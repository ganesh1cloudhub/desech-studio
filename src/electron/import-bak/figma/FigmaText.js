import ExtendJS from '../../../js/helper/ExtendJS.js'
import FigmaCommon from './FigmaCommon.js'
import ParseCommon from '../ParseCommon.js'
import FigmaFill from './FigmaFill.js'

export default {
  async getCssText (element, extra, css) {
    if (extra.data.type !== 'text' && extra.data.type !== 'inline') return
    const style = element.style
    return {
      ...this.getAlignment(style),
      ...ParseCommon.getFontFamily(style.fontFamily, css),
      ...ParseCommon.getPropValue('font-weight', this.getFontWeight(style),
        this.getFontWeight(style) !== 400),
      ...ParseCommon.getPropValue('font-style', 'italic', style.italic),
      ...ParseCommon.getPropValue('font-size', Math.round(style.fontSize) + 'px',
        style.fontSize),
      ...ParseCommon.getPropValue('line-height', this.getLineHeight(style),
        this.getLineHeight(style)),
      ...ParseCommon.getPropValue('text-transform', this.getTransform(style), style.textCase),
      ...ParseCommon.getPropValue('text-decoration-line', this.getDecoration(style),
        style.textDecoration),
      ...ParseCommon.getPropValue('letter-spacing',
        ExtendJS.roundToTwo(style.letterSpacing) + 'px', style.letterSpacing),
      // ...ParseCommon.getPropValue('text-indent', Math.round(style.paragraphIndent) + 'px',
      //   style.paragraphIndent),
      ...await this.getColor(element, extra)
    }
  },

  getProperties () {
    return [
      'font-family',
      'font-weight',
      'font-size',
      'line-height',
      'font-style',
      'text-transform',
      'text-decoration-line',
      'letter-spacing',
      'text-indent'
    ]
  },

  getAlignment (style) {
    const css = {}
    const horizAlign = style.textAlignHorizontal ? style.textAlignHorizontal.toLowerCase() : null
    if (horizAlign && horizAlign !== 'left') css['text-align'] = horizAlign
    const vertAlign = this.getAlignSelf(style)
    if (vertAlign) css['align-self'] = vertAlign
    return css
  },

  getAlignSelf (style) {
    switch (style.textAlignVertical) {
      case 'CENTER':
        return 'center'
      case 'BOTTOM':
        return 'end'
    }
  },

  getFontWeight (style) {
    // sometimes the value is not correct and should check fontPostScriptName, ie: Inter-SemiBold
    return style.fontWeight
  },

  getLineHeight (style) {
    if (!style.lineHeightPx || style.lineHeightPercent === 100) return
    return Math.round(style.lineHeightPx) + 'px'
  },

  getTransform (style) {
    switch (style.textCase) {
      case 'UPPER':
        return 'uppercase'
      case 'LOWER':
        return 'lowercase'
      case 'TITLE':
        return 'capitalize'
    }
  },

  getDecoration (style) {
    switch (style.textDecoration) {
      case 'UNDERLINE':
        return 'underline'
      case 'STRIKETHROUGH':
        return 'line-through'
    }
  },

  async getColor (element, extra) {
    if (element.fills.length === 1 && element.fills[0].type === 'SOLID') {
      return { color: FigmaCommon.getObjectColor(element.fills[0]) }
    } else if (element.fills.length) {
      let css = ParseCommon.getTextBackgroundCss()
      if (extra.data.type === 'inline') {
        css = { ...css, ...await FigmaFill.getCssFill(element, extra) }
      }
      return css
    }
  }
}