import { getHtmlTagDefinition } from './html_tags'
import {
  DEFAULT_INTERPOLATION_CONFIG,
  InterpolationConfig
} from './interpolation_config'
import { ParseTreeResult, Parser, ParserOptions } from './parser'

export { ParseTreeResult, TreeError } from './parser'

export class HtmlParser extends Parser {
  constructor(
    public options: ParserOptions = {
      decodeEntities: true,
      ignoreFirstLf: true,
      insertRequiredParents: false,
      selfClosingCustomElements: false
    }
  ) {
    super(options, getHtmlTagDefinition)
  }

  parse(
    source: string,
    url: string,
    interpolationConfig: InterpolationConfig = DEFAULT_INTERPOLATION_CONFIG
  ): ParseTreeResult {
    return super.parse(source, url, interpolationConfig)
  }
}
