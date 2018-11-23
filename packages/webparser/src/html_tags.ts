import { TagContentType, TagDefinition } from './tags'

export class HtmlTagDefinition implements TagDefinition {
  private closedByChildren: { [key: string]: boolean } = {}

  closedByParent: boolean = false
  // TODO(issue/24571): remove '!'.
  requiredParents!: { [key: string]: boolean }
  // TODO(issue/24571): remove '!'.
  parentToAdd!: string
  implicitNamespacePrefix: string | null
  contentType: TagContentType
  isVoid: boolean
  ignoreFirstLf: boolean
  canSelfClose: boolean

  constructor({
    closedByChildren,
    requiredParents,
    implicitNamespacePrefix,
    contentType = TagContentType.PARSABLE_DATA,
    closedByParent = false,
    isVoid = false,
    ignoreFirstLf = false,
    canSelfClose = false
  }: {
    closedByChildren?: string[]
    closedByParent?: boolean
    requiredParents?: string[]
    implicitNamespacePrefix?: string
    contentType?: TagContentType
    isVoid?: boolean
    ignoreFirstLf?: boolean
    canSelfClose?: boolean
  } = {}) {
    if (closedByChildren && closedByChildren.length > 0) {
      closedByChildren.forEach(
        tagName => (this.closedByChildren[tagName] = true)
      )
    }
    this.isVoid = isVoid
    this.canSelfClose = canSelfClose
    this.closedByParent = closedByParent || isVoid
    if (requiredParents && requiredParents.length > 0) {
      this.requiredParents = {}
      // The first parent is the list is automatically when none of the listed parents are present
      this.parentToAdd = requiredParents[0]
      requiredParents.forEach(tagName => (this.requiredParents[tagName] = true))
    }
    this.implicitNamespacePrefix = implicitNamespacePrefix || null
    this.contentType = contentType
    this.ignoreFirstLf = ignoreFirstLf
  }

  requireExtraParent(currentParent: string): boolean {
    if (!this.requiredParents) {
      return false
    }

    if (!currentParent) {
      return true
    }

    const lcParent = currentParent.toLowerCase()
    const isParentTemplate =
      lcParent === 'template' || currentParent === 'ng-template'
    return !isParentTemplate && this.requiredParents[lcParent] != true
  }

  isClosedByChild(name: string): boolean {
    return this.isVoid || name.toLowerCase() in this.closedByChildren
  }
}

// see http://www.w3.org/TR/html51/syntax.html#optional-tags
// This implementation isn't fully conform to the HTML5 spec.
let TAG_DEFINITIONS: Map<
  string,
  { [key: string]: HtmlTagDefinition }
> = new Map()

export function getHtmlTagDefinition(
  tagName: string,
  ignoreFirstLf: boolean,
  canSelfClose: boolean
): HtmlTagDefinition {
  const cacheKey = `${ignoreFirstLf},${canSelfClose}`

  // we store different views of the tag definition that's why we need a cache invalidation strategy
  if (!TAG_DEFINITIONS.has(cacheKey)) {
    TAG_DEFINITIONS.set(cacheKey, {
      base: new HtmlTagDefinition({ isVoid: true, canSelfClose }),
      meta: new HtmlTagDefinition({ isVoid: true, canSelfClose }),
      area: new HtmlTagDefinition({ isVoid: true, canSelfClose }),
      embed: new HtmlTagDefinition({ isVoid: true, canSelfClose }),
      link: new HtmlTagDefinition({ isVoid: true, canSelfClose }),
      img: new HtmlTagDefinition({ isVoid: true, canSelfClose }),
      image: new HtmlTagDefinition({ isVoid: true, canSelfClose }),
      input: new HtmlTagDefinition({ isVoid: true, canSelfClose }),
      param: new HtmlTagDefinition({ isVoid: true, canSelfClose }),
      hr: new HtmlTagDefinition({ isVoid: true, canSelfClose }),
      br: new HtmlTagDefinition({ isVoid: true, canSelfClose }),
      source: new HtmlTagDefinition({ isVoid: true, canSelfClose }),
      track: new HtmlTagDefinition({ isVoid: true, canSelfClose }),
      wbr: new HtmlTagDefinition({ isVoid: true, canSelfClose }),
      p: new HtmlTagDefinition({
        closedByChildren: [
          'address',
          'article',
          'aside',
          'blockquote',
          'div',
          'dl',
          'fieldset',
          'footer',
          'form',
          'h1',
          'h2',
          'h3',
          'h4',
          'h5',
          'h6',
          'header',
          'hgroup',
          'hr',
          'main',
          'nav',
          'ol',
          'p',
          'pre',
          'section',
          'table',
          'ul'
        ],
        closedByParent: true,
        canSelfClose
      }),
      thead: new HtmlTagDefinition({
        closedByChildren: ['tbody', 'tfoot'],
        canSelfClose
      }),
      tbody: new HtmlTagDefinition({
        closedByChildren: ['tbody', 'tfoot'],
        closedByParent: true,
        canSelfClose
      }),
      tfoot: new HtmlTagDefinition({
        closedByChildren: ['tbody'],
        closedByParent: true,
        canSelfClose
      }),
      tr: new HtmlTagDefinition({
        closedByChildren: ['tr'],
        requiredParents: ['tbody', 'tfoot', 'thead'],
        closedByParent: true,
        canSelfClose
      }),
      td: new HtmlTagDefinition({
        closedByChildren: ['td', 'th'],
        closedByParent: true,
        canSelfClose
      }),
      th: new HtmlTagDefinition({
        closedByChildren: ['td', 'th'],
        closedByParent: true,
        canSelfClose
      }),
      col: new HtmlTagDefinition({
        requiredParents: ['colgroup'],
        isVoid: true,
        canSelfClose
      }),
      svg: new HtmlTagDefinition({
        implicitNamespacePrefix: 'svg',
        canSelfClose
      }),
      math: new HtmlTagDefinition({
        implicitNamespacePrefix: 'math',
        canSelfClose
      }),
      li: new HtmlTagDefinition({
        closedByChildren: ['li'],
        closedByParent: true,
        canSelfClose
      }),
      dt: new HtmlTagDefinition({
        closedByChildren: ['dt', 'dd'],
        canSelfClose
      }),
      dd: new HtmlTagDefinition({
        closedByChildren: ['dt', 'dd'],
        closedByParent: true,
        canSelfClose
      }),
      rb: new HtmlTagDefinition({
        closedByChildren: ['rb', 'rt', 'rtc', 'rp'],
        closedByParent: true,
        canSelfClose
      }),
      rt: new HtmlTagDefinition({
        closedByChildren: ['rb', 'rt', 'rtc', 'rp'],
        closedByParent: true,
        canSelfClose
      }),
      rtc: new HtmlTagDefinition({
        closedByChildren: ['rb', 'rtc', 'rp'],
        closedByParent: true,
        canSelfClose
      }),
      rp: new HtmlTagDefinition({
        closedByChildren: ['rb', 'rt', 'rtc', 'rp'],
        closedByParent: true,
        canSelfClose
      }),
      optgroup: new HtmlTagDefinition({
        closedByChildren: ['optgroup'],
        closedByParent: true,
        canSelfClose
      }),
      option: new HtmlTagDefinition({
        closedByChildren: ['option', 'optgroup'],
        closedByParent: true,
        canSelfClose
      }),
      pre: new HtmlTagDefinition({ ignoreFirstLf, canSelfClose }),
      listing: new HtmlTagDefinition({ ignoreFirstLf, canSelfClose }),
      style: new HtmlTagDefinition({
        contentType: TagContentType.RAW_TEXT,
        canSelfClose
      }),
      script: new HtmlTagDefinition({
        contentType: TagContentType.RAW_TEXT,
        canSelfClose
      }),
      title: new HtmlTagDefinition({
        contentType: TagContentType.ESCAPABLE_RAW_TEXT,
        canSelfClose
      }),
      textarea: new HtmlTagDefinition({
        contentType: TagContentType.ESCAPABLE_RAW_TEXT,
        ignoreFirstLf,
        canSelfClose
      })
    })
  }
  return (
    TAG_DEFINITIONS.get(cacheKey)[tagName] ||
    new HtmlTagDefinition({ canSelfClose })
  )
}

export function isKnownHTMLTag(tagName: string): boolean {
  return tagName.toUpperCase() in TAG_DICTIONARY
}

const TAG_DICTIONARY: { [name: string]: string } = {
  A: 'a',
  ADDRESS: 'address',
  ANNOTATION_XML: 'annotation-xml',
  APPLET: 'applet',
  AREA: 'area',
  ARTICLE: 'article',
  ASIDE: 'aside',

  B: 'b',
  BASE: 'base',
  BASEFONT: 'basefont',
  BGSOUND: 'bgsound',
  BIG: 'big',
  BLOCKQUOTE: 'blockquote',
  BODY: 'body',
  BR: 'br',
  BUTTON: 'button',

  CAPTION: 'caption',
  CENTER: 'center',
  CODE: 'code',
  COL: 'col',
  COLGROUP: 'colgroup',

  DD: 'dd',
  DESC: 'desc',
  DETAILS: 'details',
  DIALOG: 'dialog',
  DIR: 'dir',
  DIV: 'div',
  DL: 'dl',
  DT: 'dt',

  EM: 'em',
  EMBED: 'embed',

  FIELDSET: 'fieldset',
  FIGCAPTION: 'figcaption',
  FIGURE: 'figure',
  FONT: 'font',
  FOOTER: 'footer',
  FOREIGN_OBJECT: 'foreignObject',
  FORM: 'form',
  FRAME: 'frame',
  FRAMESET: 'frameset',

  H1: 'h1',
  H2: 'h2',
  H3: 'h3',
  H4: 'h4',
  H5: 'h5',
  H6: 'h6',
  HEAD: 'head',
  HEADER: 'header',
  HGROUP: 'hgroup',
  HR: 'hr',
  HTML: 'html',

  I: 'i',
  IMG: 'img',
  IMAGE: 'image',
  INPUT: 'input',
  IFRAME: 'iframe',

  KEYGEN: 'keygen',

  LABEL: 'label',
  LI: 'li',
  LINK: 'link',
  LISTING: 'listing',

  MAIN: 'main',
  MALIGNMARK: 'malignmark',
  MARQUEE: 'marquee',
  MATH: 'math',
  MENU: 'menu',
  META: 'meta',
  MGLYPH: 'mglyph',
  MI: 'mi',
  MO: 'mo',
  MN: 'mn',
  MS: 'ms',
  MTEXT: 'mtext',

  NAV: 'nav',
  NOBR: 'nobr',
  NOFRAMES: 'noframes',
  NOEMBED: 'noembed',
  NOSCRIPT: 'noscript',

  OBJECT: 'object',
  OL: 'ol',
  OPTGROUP: 'optgroup',
  OPTION: 'option',

  P: 'p',
  PARAM: 'param',
  PLAINTEXT: 'plaintext',
  PRE: 'pre',

  RB: 'rb',
  RP: 'rp',
  RT: 'rt',
  RTC: 'rtc',
  RUBY: 'ruby',

  S: 's',
  SCRIPT: 'script',
  SECTION: 'section',
  SELECT: 'select',
  SOURCE: 'source',
  SMALL: 'small',
  SPAN: 'span',
  STRIKE: 'strike',
  STRONG: 'strong',
  STYLE: 'style',
  SUB: 'sub',
  SUMMARY: 'summary',
  SUP: 'sup',

  TABLE: 'table',
  TBODY: 'tbody',
  TEMPLATE: 'template',
  TEXTAREA: 'textarea',
  TFOOT: 'tfoot',
  TD: 'td',
  TH: 'th',
  THEAD: 'thead',
  TITLE: 'title',
  TR: 'tr',
  TRACK: 'track',
  TT: 'tt',

  U: 'u',
  UL: 'ul',

  SVG: 'svg',

  VAR: 'var',

  WBR: 'wbr',

  XMP: 'xmp'
}
