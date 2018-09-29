declare module prettyhtml { }
declare function prettyhtml(input: string, options?: {
  tabWidth?: number,
  useTabs?: boolean,
  printWidth?: number,
  usePrettier?: boolean,
  singleQuote?: boolean
}): string;

export = prettyhtml;