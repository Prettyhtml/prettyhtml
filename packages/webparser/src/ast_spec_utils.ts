import * as html from './ast'
import { ParseTreeResult } from './html_parser'
import { ParseLocation } from './parse_util'

export function humanizeDom(
  parseResult: ParseTreeResult,
  addSourceSpan: boolean = false
): any[] {
  if (parseResult.errors.length > 0) {
    const errorString = parseResult.errors.join('\n')
    throw new Error(`Unexpected parse errors:\n${errorString}`)
  }

  return humanizeNodes(parseResult.rootNodes, addSourceSpan)
}

export function humanizeDomSourceSpans(parseResult: ParseTreeResult): any[] {
  return humanizeDom(parseResult, true)
}

export function humanizeNodes(
  nodes: html.Node[],
  addSourceSpan: boolean = false
): any[] {
  const humanizer = new _Humanizer(addSourceSpan)
  html.visitAll(humanizer, nodes)
  return humanizer.result
}

export function humanizeLineColumn(location: ParseLocation): string {
  return `${location.line}:${location.col}`
}

class _Humanizer implements html.Visitor {
  result: any[] = []
  elDepth: number = 0

  constructor(private includeSourceSpan: boolean) {}

  visitElement(element: html.Element, context: any): any {
    const input: any = [html.Element, element.name, this.elDepth++]

    if (element.implicitNs) {
      input.push(element.implicitNs)
    }

    const res = this._appendContext(element, input)
    this.result.push(res)
    html.visitAll(this, element.attrs)
    html.visitAll(this, element.children)
    this.elDepth--
  }

  visitAttribute(attribute: html.Attribute, context: any): any {
    const res = this._appendContext(attribute, [
      html.Attribute,
      attribute.name,
      attribute.value
    ])
    this.result.push(res)
  }

  visitText(text: html.Text, context: any): any {
    const res = this._appendContext(text, [html.Text, text.value, this.elDepth])
    this.result.push(res)
  }

  visitComment(comment: html.Comment, context: any): any {
    const res = this._appendContext(comment, [
      html.Comment,
      comment.value,
      this.elDepth
    ])
    this.result.push(res)
  }

  visitDoctype(doctype: html.Doctype, context: any): any {
    const res = this._appendContext(doctype, [
      html.Doctype,
      doctype.value,
      this.elDepth
    ])
    this.result.push(res)
  }

  private _appendContext(ast: html.Node, input: any[]): any[] {
    if (!this.includeSourceSpan) return input
    input.push(ast.sourceSpan!.toString())
    return input
  }
}
