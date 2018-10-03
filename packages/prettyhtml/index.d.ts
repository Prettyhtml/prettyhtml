declare namespace prettyhtml {

}
declare function prettyhtml(
  input: string,
  options?: {
    tabWidth?: number
    useTabs?: boolean
    printWidth?: number
    usePrettier?: boolean
    singleQuote?: boolean
    prettier?: {
      tabWidth?: number
      useTabs?: boolean
      printWidth?: number
      singleQuote?: boolean
    }
  }
): string

export = prettyhtml
