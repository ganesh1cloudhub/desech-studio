import FigmaStyle from '../FigmaStyle.js'
import ExtendJS from '../../../../js/helper/ExtendJS.js'
import FigmaImage from './FigmaImage.js'

export default {
  async getFills (data, node, settings = null) {
    if (data.desechType === 'icon') return
    const records = []
    for (let i = node.fills.length - 1; i >= 0; i--) {
      const imageFill = await this.processFill(records, i, data, node, settings)
      if (imageFill) return [imageFill]
    }
    await this.fixExportBitmapOnNoImageFill(records, data, node, settings)
    if (records.length) return records
  },

  async processFill (records, i, data, node, settings) {
    // fills in reverse order
    if (!FigmaStyle.isFillStrokeAllowed(node.fills[i], data.designType)) return
    const record = await this.getFill(node.fills[i], node, settings)
    // if we find an image, then we don't care about the other fills since figma renders it
    if (record.type === 'image') return record
    records.push(record)
  },

  // when we have export settings as bitmap (png, jpg) make sure we have that image fill only
  async fixExportBitmapOnNoImageFill (records, data, node, settings) {
    // we can't have image renders with text because it will contain the text too
    if (data.desechType === 'text') return
    if (node.exportSettings && ['JPG', 'PNG'].includes(node.exportSettings[0]?.format) &&
      (!records.length || records[0].type !== 'image')) {
      // make sure to remove all the other entries before adding the image
      records.splice(0, records.length)
      records.push({
        type: 'image',
        image: await FigmaImage.fetchImage(node, settings)
      })
    }
  },

  async getFill (fill, node, settings) {
    const record = {
      type: FigmaStyle.getFillStrokeType(fill.type),
      blendMode: FigmaStyle.getBlendMode(fill.blendMode)
    }
    await this.processFillType(fill, node, record, settings)
    return record
  },

  async processFillType (fill, node, record, settings) {
    switch (record.type) {
      case 'solid-color':
        return this.getFillSolid(fill, record)
      case 'linear-gradient':
        return this.getFillLinearGradient(fill, record)
      case 'radial-gradient':
        return this.getFillRadialGradient(fill, record)
      case 'image':
        return await this.getFillImage(node, record, settings)
    }
  },

  getFillSolid (fill, record) {
    record.color = FigmaStyle.getColor(fill)
  },

  getFillLinearGradient (fill, record) {
    // @todo gradient angle is not calculated correctly
    record.angle = {
      x1: fill.gradientHandlePositions[0].x,
      x2: fill.gradientHandlePositions[1].x,
      y1: fill.gradientHandlePositions[0].y,
      y2: fill.gradientHandlePositions[1].y
    }
    record.stops = this.getGradientStops(fill.gradientStops, fill.opacity)
  },

  getFillRadialGradient (fill, record) {
    // @todo add radial gradient properties
    record.stops = this.getGradientStops(fill.gradientStops, fill.opacity)
  },

  async getFillImage (node, record, settings) {
    // we are rendering the entire image element including effects, borders, text, etc
    // so if we have more than one image fill this would trigger twice
    record.image = await FigmaImage.fetchImage(node, settings)
  },

  getGradientStops (stops, opacity) {
    const values = []
    for (const stop of stops) {
      values.push({
        color: FigmaStyle.getColor({ ...stop, opacity }),
        position: ExtendJS.roundToTwo(stop.position)
      })
    }
    return values
  }
}
