import HelperStyle from '../../helper/HelperStyle.js'
import HelperElement from '../../helper/HelperElement.js'
import HelperDOM from '../../helper/HelperDOM.js'
import StateSelectedElement from '../StateSelectedElement.js'
import StyleSheetSelector from '../stylesheet/StyleSheetSelector.js'
import StyleSheetCommon from '../stylesheet/StyleSheetCommon.js'
import StateStyleSheet from '../StateStyleSheet.js'

export default {
  async addSelectorLinkClass (selector) {
    if (!HelperStyle.isClassSelector(selector)) return
    const ref = StateSelectedElement.getRef()
    const cls = HelperStyle.extractClassSelector(selector)
    await StyleSheetSelector.linkClass(cls, ref)
  },

  setElementAttribute (element, name, value) {
    if (value === null) {
      element.removeAttributeNS(null, name)
    } else {
      element.setAttributeNS(null, name, value)
    }
  },

  pasteAttributes (element, data) {
    if (!data) return
    const type = HelperElement.getType(element)
    // needs to be the same element type
    if (!data.type || type !== data.type) return
    this.pasteAttributesList(element, data.attributes, data.filter)
    this.pasteContent(element, data.content)
    this.pasteTag(element, data.tag)
  },

  pasteAttributesList (element, attributes, filter) {
    // when we have no filter, we remove all attributes
    if (!filter) HelperDOM.removeAttributes(element)
    for (const [name, value] of Object.entries(attributes)) {
      if (filter && name === 'class') {
        if (value) this.appendAttributeClass(element.classList, value.split(' '))
      } else {
        element.setAttributeNS(null, name, value)
      }
    }
  },

  appendAttributeClass (list, newClasses) {
    for (const cls of newClasses) {
      list.add(cls)
    }
  },

  pasteContent (element, content) {
    if (content) element.innerHTML = content
  },

  pasteTag (element, tag) {
    if (tag !== HelperDOM.getTag(element)) {
      // this will change the element, but it's fine, since it's the last code execution
      HelperDOM.changeTag(element, tag, document)
    }
  },

  pasteStyle (element, style) {
    // we check here if the style data needs to be processed, not if it exists
    // if this is an empty object, then it's fine because we do need to remove all styles
    if (!style) return
    this.pasteRemoveOldStyle(element)
    this.pasteAddNewStyle(element, style)
  },

  pasteRemoveOldStyle (element) {
    const selectors = StyleSheetSelector.getElementSelectors(element, 'ref')
    for (const selector of selectors) {
      StyleSheetSelector.deleteSelector(selector)
    }
  },

  pasteAddNewStyle (element, style) {
    const refSelector = StyleSheetSelector.getRefSelector(element)
    for (const [tmpSelector, rules] of Object.entries(style)) {
      const selector = tmpSelector.replace(/\.e0[a-z0-9]+/, refSelector)
      const sheet = StateStyleSheet.getCreateSelectorSheet(selector)
      StyleSheetCommon.addRemoveRules(sheet, selector, rules, true)
    }
  }
}
