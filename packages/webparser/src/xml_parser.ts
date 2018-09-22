import { ParseTreeResult, Parser } from './parser'
import { getXmlTagDefinition } from './xml_tags'

export { ParseTreeResult, TreeError } from './parser'

export class XmlParser extends Parser {
  constructor() {
    super(getXmlTagDefinition)
  }

  parse(
    source: string,
    url: string,
    parseExpansionForms: boolean = false
  ): ParseTreeResult {
    return super.parse(source, url, parseExpansionForms)
  }
}
