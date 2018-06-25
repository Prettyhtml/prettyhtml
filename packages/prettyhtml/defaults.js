'use strict'

const defaults = { parser: {} }

// to mark normal html elements as custom elements for formatting
defaults.parser.customElementAttrMarker = ['*', '[', ']', '(', ')', '#']
defaults.parser.customElementAttrValueMarker = ['{{', '}}']
defaults.parser.fragment = true

module.exports = defaults
