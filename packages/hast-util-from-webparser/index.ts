import {
  ParseSourceSpan,
  splitNsName,
  Element,
  Comment,
  Text,
  Node,
  Doctype
} from 'webparser'

let htmlSchema = require('property-information/html')
let svgSchema = require('property-information/svg')
let hastSvg = require('@starptech/prettyhtml-hastscript/svg')
let hast = require('@starptech/prettyhtml-hastscript')

function isFakeRoot(obj: Element): boolean {
  return obj.name === ':webparser:root'
}

type Options = {
  file?: string
  verbose?: boolean
  schema?: { space: string }
  documentMode?: boolean
}

type HastNode = {
  name?: string
  type: string
  tagName?: string
  properties?: Array<Object>
  children?: HastNode[]
  public?: string
  system?: string
  value?: string
  data?: { [name: string]: any }
}

/* Wrapper to normalise options. */
export = function from(rootNodes: Node[], options: Options) {
  const sourceSpan = new ParseSourceSpan(null, null)
  const fakeRoot = new Element(':webparser:root', [], rootNodes, sourceSpan)
  const result = transform(fakeRoot, {
    schema: htmlSchema,
    file: options.file,
    verbose: options.verbose
  })

  return result
}

/* Transform a node. */
function transform(ast: Node, config: Options): HastNode {
  let schema = config.schema
  let node: HastNode

  if (ast instanceof Element) {
    let children: HastNode[]
    config.schema = getNameAndNS(ast.name).ns === 'svg' ? svgSchema : htmlSchema
    if (ast.children && ast.children.length) {
      children = nodes(ast.children, config)
    }

    if (isFakeRoot(ast)) {
      node = root(ast, children)
    } else {
      node = element(ast, children, config)
    }

    node.data = node.data || {}
    node.data.selfClosing =
      ast.startSourceSpan === ast.endSourceSpan &&
      ast.startSourceSpan !== null &&
      ast.endSourceSpan !== null
  } else if (ast instanceof Text) {
    node = text(ast)
  } else if (ast instanceof Comment) {
    node = comment(ast)
  } else if (ast instanceof Doctype) {
    node = {
      type: 'doctype',
      name: 'html',
      public: null,
      system: null
    }
  }

  config.schema = schema

  return node
}

/* Transform children. */
function nodes(children: Node[], config: Options): HastNode[] {
  let length = children.length
  let index = -1
  let result: HastNode[] = []

  while (++index < length) {
    result[index] = transform(children[index], config)
  }

  return result
}

function root(ast: Node, children: HastNode[]): HastNode {
  return { type: 'root', children, data: {} }
}

/* Transform a text. */
function text(ast: Text): HastNode {
  return { type: 'text', value: ast.value }
}

/* Transform a comment. */
function comment(ast: Comment): HastNode {
  return { type: 'comment', value: ast.value }
}

function getNameAndNS(name: string) {
  if (name[0] === ':') {
    return { ns: null, name: name }
  }

  const info = splitNsName(name)
  return { ns: info[0], name: info[1] }
}

/* Transform an element. */
function element(
  ast: Element,
  children: HastNode[],
  config: Options
): HastNode {
  let fn = config.schema.space === 'svg' ? hastSvg : hast
  let name = getNameAndNS(ast.name).name
  let props: { [name: string]: string } = {}
  let node

  for (const attr of ast.attrs) {
    const attrInfo = getNameAndNS(attr.name)
    props[attrInfo.ns ? attrInfo.ns + ':' + attrInfo.name : attrInfo.name] =
      attr.value
  }

  node = fn(name, props, children)

  return node
}
