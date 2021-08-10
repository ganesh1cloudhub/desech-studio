import ExtendJS from '../../../js/helper/ExtendJS.js'
import ImportCommon from '../ImportCommon.js'

export default {
  getRotation (node) {
    // @todo correct the rotation angle; also the "y" coordinate of the element is wrong
    // const m = node.relativeTransform
    // const angle = Math.atan2(-m[1][0], m[0][0])
  },

  getRoundedCorners (node) {
    if (node.rectangleCornerRadii) {
      return node.rectangleCornerRadii
    } else if (node.cornerRadius) {
      const val = node.cornerRadius
      return [val, val, val, val]
    }
  },

  getBlendMode (mode) {
    if (!mode) return
    const value = mode.toLowerCase().replace('_', '-').replace('linear', 'color')
      .replace('pass-through', 'normal')
    if (value !== 'normal') return value
    // PASS_THROUGH, NORMAL => normal
    // DARKEN => darken
    // MULTIPLY => multiply
    // LINEAR_BURN, COLOR_BURN => color-burn
    // LIGHTEN => lighten
    // SCREEN => screen
    // LINEAR_DODGE, COLOR_DODGE => color-dodge
    // OVERLAY => overlay
    // SOFT_LIGHT => soft-light
    // HARD_LIGHT => hard-light
    // DIFFERENCE => difference
    // EXCLUSION => exclusion
    // HUE => hue
    // SATURATION => saturation
    // COLOR => color
    // LUMINOSITY => luminosity
  },

  getOpacity (opacity) {
    if (typeof opacity !== 'undefined') {
      return ExtendJS.roundToTwo(opacity)
    }
  },

  isFillStrokeAllowed (value, designType) {
    if (value.visible === false) return false
    // we can't have image renders with text because it will contain the text too
    if (value.type === 'IMAGE' && designType === 'text') return false
    return true
  },

  getFillStrokeType (type) {
    switch (type) {
      case 'SOLID':
        return 'solid-color'
      case 'IMAGE':
        return 'image'
      case 'GRADIENT_LINEAR':
        return 'linear-gradient'
      default:
        // GRADIENT_RADIAL, GRADIENT_ANGULAR, GRADIENT_DIAMOND
        return 'radial-gradient'
    }
  },

  getColor (obj) {
    const rgb = [
      Math.round(obj.color.r * 255),
      Math.round(obj.color.g * 255),
      Math.round(obj.color.b * 255)
    ]
    const alpha = (typeof obj.opacity === 'undefined') ? obj.color.a : obj.opacity * obj.color.a
    return ImportCommon.getColor(rgb, alpha)
  }
}