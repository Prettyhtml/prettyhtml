declare module '@starptech/prettyhtml' {
  export default function prettyhtml(input: string, options?: {
    tabWidth?: number,
    useTabs?: boolean,
    printWidth?: number,
    usePrettier?: boolean,
    singleQuote?: boolean
  }): string;
}
