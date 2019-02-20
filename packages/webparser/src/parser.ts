import { ParseError, ParseSourceSpan } from './parse_util'

import * as html from './ast'
import { DEFAULT_INTERPOLATION_CONFIG, InterpolationConfig } from './interpolation_config'
import * as lex from './lexer'
import { TagDefinition, getNsPrefix, isNgContainer, mergeNsAndName } from './tags'
import { isKnownHTMLTag } from './html_tags'

export class TreeError extends ParseError {
  static create(elementName: string | null, span: ParseSourceSpan, msg: string): TreeError {
    return new TreeError(elementName, span, msg)
  }

  constructor(public elementName: string | null, span: ParseSourceSpan, msg: string) {
    super(span, msg)
  }
}

export interface ParserOptions {
  decodeEntities?: boolean
  insertRequiredParents?: boolean
  ignoreFirstLf?: boolean
  selfClosingElements?: boolean
  selfClosingCustomElements?: boolean
}

export interface TreeBuilderOptions {
  ignoreFirstLf?: boolean
  insertRequiredParents?: boolean
  selfClosingElements?: boolean
  selfClosingCustomElements?: boolean
}

export class ParseTreeResult {
  constructor(public rootNodes: html.Node[], public errors: ParseError[]) {}
}

export class Parser {
  constructor(
    public options: ParserOptions = {
      decodeEntities: true,
      ignoreFirstLf: true,
      insertRequiredParents: false,
      selfClosingElements: false,
      selfClosingCustomElements: false
    },
    public getTagDefinition: (tagName: string, ignoreFirstLf: boolean, canSelfClose: boolean) => TagDefinition
  ) {}

  parse(
    source: string,
    url: string,
    interpolationConfig: InterpolationConfig = DEFAULT_INTERPOLATION_CONFIG
  ): ParseTreeResult {
    const tokensAndErrors = lex.tokenize(
      source,
      url,
      this.getTagDefinition,
      interpolationConfig,
      this.options
    )

    const treeAndErrors = new _TreeBuilder(
      this.options,
      tokensAndErrors.tokens,
      this.getTagDefinition
    ).build()

    return new ParseTreeResult(
      treeAndErrors.rootNodes,
      (<ParseError[]>tokensAndErrors.errors).concat(treeAndErrors.errors)
    )
  }
}

class _TreeBuilder {
  private _index: number = -1
  // TODO(issue/24571): remove '!'.
  private _peek!: lex.Token

  private _rootNodes: html.Node[] = []
  private _errors: TreeError[] = []

  private _elementStack: html.Element[] = []

  constructor(
    private options: TreeBuilderOptions,
    private tokens: lex.Token[],
    private getTagDefinition: (
      tagName: string,
      ignoreFirstLf: boolean,
      canSelfClose: boolean
    ) => TagDefinition
  ) {
    this._advance()
  }

  build(): ParseTreeResult {
    while (this._peek.type !== lex.TokenType.EOF) {
      if (this._peek.type === lex.TokenType.DOC_TYPE) {
        this._consumeDoctype(this._advance())
      } else if (this._peek.type === lex.TokenType.TAG_OPEN_START) {
        this._consumeStartTag(this._advance())
      } else if (this._peek.type === lex.TokenType.TAG_CLOSE) {
        this._consumeEndTag(this._advance())
      } else if (this._peek.type === lex.TokenType.CDATA_START) {
        this._closeVoidElement()
        this._consumeCdata(this._advance())
      } else if (this._peek.type === lex.TokenType.COMMENT_START) {
        this._closeVoidElement()
        this._consumeComment(this._advance())
      } else if (
        this._peek.type === lex.TokenType.TEXT ||
        this._peek.type === lex.TokenType.RAW_TEXT ||
        this._peek.type === lex.TokenType.ESCAPABLE_RAW_TEXT
      ) {
        this._closeVoidElement()
        this._consumeText(this._advance())
      } else {
        // Skip all other tokens...
        this._advance()
      }
    }
    return new ParseTreeResult(this._rootNodes, this._errors)
  }

  private _advance(): lex.Token {
    const prev = this._peek
    if (this._index < this.tokens.length - 1) {
      // Note: there is always an EOF token at the end
      this._index++
    }
    this._peek = this.tokens[this._index]
    return prev
  }

  private _advanceIf(type: lex.TokenType): lex.Token | null {
    if (this._peek.type === type) {
      return this._advance()
    }
    return null
  }

  private _consumeCdata(startToken: lex.Token) {
    this._consumeText(this._advance())
    this._advanceIf(lex.TokenType.CDATA_END)
  }

  private _consumeComment(token: lex.Token) {
    const text = this._advanceIf(lex.TokenType.RAW_TEXT)
    this._advanceIf(lex.TokenType.COMMENT_END)
    const value = text != null ? text.parts[0] : null
    this._addToParent(new html.Comment(value, token.sourceSpan))
  }

  private _consumeDoctype(token: lex.Token) {
    const value = token.parts.length ? token.parts[0] : null
    this._addToParent(new html.Doctype(value, token.sourceSpan))
  }

  private _consumeText(token: lex.Token) {
    let text = token.parts[0]
    if (text.length > 0 && text[0] == '\n') {
      const parent = this._getParentElement()
      if (
        parent != null &&
        parent.children.length == 0 &&
        this.getTagDefinition(parent.name, this.options.ignoreFirstLf, this.options.selfClosingElements)
          .ignoreFirstLf
      ) {
        text = text.substring(1)
      }
    }

    if (text.length > 0) {
      this._addToParent(new html.Text(text, token.sourceSpan))
    }
  }

  private _closeVoidElement(): void {
    const el = this._getParentElement()
    if (
      el &&
      this.getTagDefinition(el.name, this.options.ignoreFirstLf, this.options.selfClosingElements).isVoid
    ) {
      this._elementStack.pop()
    }
  }

  private _consumeStartTag(startTagToken: lex.Token) {
    const prefix = startTagToken.parts[0]
    const name = startTagToken.parts[1]
    const attrs: html.Attribute[] = []
    while (this._peek.type === lex.TokenType.ATTR_NAME) {
      attrs.push(this._consumeAttr(this._advance()))
    }
    const nameAndNsInfo = this._getElementNameAndNsInfo(prefix, name, this._getParentElement())
    let selfClosing = false
    // Note: There could have been a tokenizer error
    // so that we don't get a token for the end tag...
    if (this._peek.type === lex.TokenType.TAG_OPEN_END_VOID) {
      this._advance()
      selfClosing = true
      const tagDef = this.getTagDefinition(
        nameAndNsInfo.fullName,
        this.options.ignoreFirstLf,
        this.options.selfClosingElements
      )
      if (
        !(
          tagDef.canSelfClose ||
          getNsPrefix(nameAndNsInfo.fullName) !== null ||
          tagDef.isVoid ||
          // allow self-closing custom elements
          (this.options.selfClosingCustomElements && isKnownHTMLTag(nameAndNsInfo.fullName) === false)
        )
      ) {
        this._errors.push(
          TreeError.create(
            nameAndNsInfo.fullName,
            startTagToken.sourceSpan,
            `Only void, foreign or custom elements can be self closed "${startTagToken.parts[1]}"`
          )
        )
      }
    } else if (this._peek.type === lex.TokenType.TAG_OPEN_END) {
      this._advance()
      selfClosing = false
    }
    const end = this._peek.sourceSpan.start
    const span = new ParseSourceSpan(startTagToken.sourceSpan.start, end)
    const el = new html.Element(
      nameAndNsInfo.fullName,
      attrs,
      [],
      nameAndNsInfo.implicitNs,
      span,
      span,
      undefined
    )
    this._pushElement(el)
    if (selfClosing) {
      this._popElement(nameAndNsInfo.fullName)
      el.endSourceSpan = span
    }
  }

  private _pushElement(el: html.Element) {
    const parentEl = this._getParentElement()

    if (
      parentEl &&
      this.getTagDefinition(
        parentEl.name,
        this.options.ignoreFirstLf,
        this.options.selfClosingElements
      ).isClosedByChild(el.name)
    ) {
      this._elementStack.pop()
    }

    if (this.options.insertRequiredParents) {
      const tagDef = this.getTagDefinition(
        el.name,
        this.options.ignoreFirstLf,
        this.options.selfClosingElements
      )
      const { parent, container } = this._getParentElementSkippingContainers()

      if (parent && tagDef.requireExtraParent(parent.name)) {
        const newParent = new html.Element(
          tagDef.parentToAdd,
          [],
          [],
          el.implicitNs,
          el.sourceSpan,
          el.startSourceSpan,
          el.endSourceSpan
        )
        this._insertBeforeContainer(parent, container, newParent)
      }
    }

    this._addToParent(el)
    this._elementStack.push(el)
  }

  private _consumeEndTag(endTagToken: lex.Token) {
    const nameInfo = this._getElementNameAndNsInfo(
      endTagToken.parts[0],
      endTagToken.parts[1],
      this._getParentElement()
    )

    if (this._getParentElement()) {
      this._getParentElement()!.endSourceSpan = endTagToken.sourceSpan
    }

    if (
      this.getTagDefinition(nameInfo.fullName, this.options.ignoreFirstLf, this.options.selfClosingElements)
        .isVoid
    ) {
      this._errors.push(
        TreeError.create(
          nameInfo.fullName,
          endTagToken.sourceSpan,
          `Void elements do not have end tags "${endTagToken.parts[1]}"`
        )
      )
    } else if (!this._popElement(nameInfo.fullName)) {
      const errMsg = `Unexpected closing tag "${
        nameInfo.fullName
      }". It may happen when the tag has already been closed by another tag. For more info see https://www.w3.org/TR/html5/syntax.html#closing-elements-that-have-implied-end-tags`
      this._errors.push(TreeError.create(nameInfo.fullName, endTagToken.sourceSpan, errMsg))
    }
  }

  private _popElement(fullName: string): boolean {
    for (let stackIndex = this._elementStack.length - 1; stackIndex >= 0; stackIndex--) {
      const el = this._elementStack[stackIndex]
      if (el.name == fullName) {
        this._elementStack.splice(stackIndex, this._elementStack.length - stackIndex)
        return true
      }

      if (
        !this.getTagDefinition(el.name, this.options.ignoreFirstLf, this.options.selfClosingElements)
          .closedByParent
      ) {
        return false
      }
    }
    return false
  }

  private _consumeAttr(attrName: lex.Token): html.Attribute {
    const fullName = mergeNsAndName(attrName.parts[0], attrName.parts[1])
    let implicitNs = attrName.parts[0] != null
    let end = attrName.sourceSpan.end
    let value = ''
    let valueSpan: ParseSourceSpan = undefined!
    if (this._peek.type === lex.TokenType.ATTR_VALUE) {
      const valueToken = this._advance()
      value = valueToken.parts[0]
      end = valueToken.sourceSpan.end
      valueSpan = valueToken.sourceSpan
    }
    return new html.Attribute(
      fullName,
      value,
      implicitNs,
      new ParseSourceSpan(attrName.sourceSpan.start, end),
      valueSpan
    )
  }

  private _getParentElement(): html.Element | null {
    return this._elementStack.length > 0 ? this._elementStack[this._elementStack.length - 1] : null
  }

  /**
   * Returns the parent in the DOM and the container.
   *
   * `<ng-container>` elements are skipped as they are not rendered as DOM element.
   */
  private _getParentElementSkippingContainers(): {
    parent: html.Element | null
    container: html.Element | null
  } {
    let container: html.Element | null = null

    for (let i = this._elementStack.length - 1; i >= 0; i--) {
      if (!isNgContainer(this._elementStack[i].name)) {
        return { parent: this._elementStack[i], container }
      }
      container = this._elementStack[i]
    }

    return { parent: null, container }
  }

  private _addToParent(node: html.Node) {
    const parent = this._getParentElement()
    if (parent != null) {
      parent.children.push(node)
    } else {
      this._rootNodes.push(node)
    }
  }

  /**
   * Insert a node between the parent and the container.
   * When no container is given, the node is appended as a child of the parent.
   * Also updates the element stack accordingly.
   *
   * @internal
   */
  private _insertBeforeContainer(parent: html.Element, container: html.Element | null, node: html.Element) {
    if (!container) {
      this._addToParent(node)
      this._elementStack.push(node)
    } else {
      if (parent) {
        // replace the container with the new node in the children
        const index = parent.children.indexOf(container)
        parent.children[index] = node
      } else {
        this._rootNodes.push(node)
      }
      node.children.push(container)
      this._elementStack.splice(this._elementStack.indexOf(container), 0, node)
    }
  }

  private _getElementNameAndNsInfo(
    prefix: string,
    localName: string,
    parentElement: html.Element | null
  ): { fullName: string; implicitNs: boolean } {
    let implicitNs = false
    if (prefix == null) {
      prefix = this.getTagDefinition(localName, this.options.ignoreFirstLf, this.options.selfClosingElements)
        .implicitNamespacePrefix!
      if (prefix) {
        implicitNs = true
      }
      if (prefix == null && parentElement != null) {
        prefix = getNsPrefix(parentElement.name)
        if (prefix != null) {
          implicitNs = true
        }
      }
    }

    return { fullName: mergeNsAndName(prefix, localName), implicitNs }
  }
}

function lastOnStack(stack: any[], element: any): boolean {
  return stack.length > 0 && stack[stack.length - 1] === element
}
