import { HtmlParser, ParseErrorLevel } from '@starptech/webparser'
import fromWebparser from '@starptech/hast-util-from-webparser'

interface ParseOptions {
  ignoreFirstLf?: boolean
  decodeEntities?: boolean
  selfClosingCustomElements?: boolean
}
interface VFile {
  path: string
  message(reason: string, position: any, origin: string): void
  fail(reason: string, position: any, origin: string): void
}

export = function parse(options: ParseOptions = {}): any {
  this.Parser = parser

  function parser(doc: string, file: VFile) {
    const parseResult = new HtmlParser(options).parse(doc, file.path)

    for (const err of parseResult.errors.filter(
      e => e.level === ParseErrorLevel.WARNING
    )) {
      file.message(
        err.msg,
        {
          start: {
            // webparser format counts lines beginning from zero
            line: ++err.span.start.line,
            offset: err.span.start.offset,
            column: err.span.start.col
          },
          end: {
            line: ++err.span.end.line,
            offset: err.span.end.offset,
            column: err.span.end.col
          }
        },
        'ParseError'
      )
    }

    // log the last error because the lexer will throw at first with a less meaningful error message
    for (const err of parseResult.errors
      .filter(e => e.level === ParseErrorLevel.ERROR)
      .reverse()) {
      file.fail(
        err.msg,
        {
          start: {
            // webparser format counts lines beginning from zero
            line: ++err.span.start.line,
            offset: err.span.start.offset,
            column: err.span.start.col
          },
          end: {
            line: ++err.span.end.line,
            offset: err.span.end.offset,
            column: err.span.end.col
          }
        },
        'ParseError'
      )
    }

    return fromWebparser(parseResult.rootNodes, options)
  }
}
