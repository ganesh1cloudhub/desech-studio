import ImportCommon from '../ImportCommon.js'
import SketchCommon from './SketchCommon.js'
import SketchStyle from './SketchStyle.js'
import SketchEffect from './style/SketchEffect.js'
import HelperElement from '../../../js/helper/HelperElement.js'
import ExtendJS from '../../../js/helper/ExtendJS.js'

export default {
  getPos (node, currentPos) {
    if (node) {
      return {
        x: Math.round((currentPos?.x || 0) + node.frame.x),
        y: Math.round((currentPos?.y || 0) + node.frame.y)
      }
    }
  },

  async getData (node, parent, parentPos, settings) {
    const desechType = this.getDesechType(node)
    if (!desechType || !node.isVisible) return
    const data = this.getBasicData(desechType, node, parentPos)
    await this.addStyle(data, node, settings)
    return data
  },

  getDesechType (node) {
    // ignore slice, MSImmutableHotspotLayer
    switch (node._class) {
      case 'group': case 'rectangle': case 'bitmap': case 'oval':
      case 'symbolMaster': case 'symbolInstance':
        return 'block'
      case 'text':
        return 'text'
      case 'triangle': case 'shapePath': case 'star': case 'polygon': case 'shapeGroup':
        return 'icon'
    }
  },

  getBasicData (desechType, node, parentPos) {
    return {
      desechType,
      designType: this.getDesignType(node),
      id: node.do_objectID,
      ref: HelperElement.generateElementRef(),
      name: node.name.substring(0, 32),
      ...this.getPos(node, parentPos),
      width: SketchCommon.getWidth(desechType, node),
      height: SketchCommon.getHeight(desechType, node),
      content: '',
      style: {},
      inlineChildren: [],
      debug: ExtendJS.cloneData(node)
    }
  },

  getDesignType (node) {
    // we mention `ellipse` in the general import code for rounded corners
    return ImportCommon.sanitizeName(node._class).replace('oval', 'ellipse')
  },

  async addStyle (data, node, settings) {
    data.style = ImportCommon.removeUndefined({
      layout: SketchStyle.getAutoLayout(node),
      // text: SketchText.getText(node.style, data),
      // fills: await SketchFillStroke.getFills(data, node, settings),
      // stroke: await SketchFillStroke.getStroke(data, node, settings),
      corners: SketchStyle.getRoundedCorners(node),
      effects: SketchEffect.getEffects(node),
      opacity: SketchStyle.getOpacity(node),
      blendMode: SketchStyle.getBlendMode(node),
      rotation: SketchStyle.getRotation(node)
    })
  }
}