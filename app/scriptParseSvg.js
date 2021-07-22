// we need this to create svg elements inside our temp iframe
// and then call getBBox() to get the x, y, width and height of the svg
(() => {
  // grab our iframe container
  const container = document.getElementById('temp').contentWindow.document.body

  // go through each svg element
  const data = JSON.parse('{{DATA}}')
  for (const val of Object.values(data)) {
    // create and append the svg with our designed svg path
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    svg.setAttributeNS('http://www.w3.org/2000/xmlns/', 'xmlns', 'http://www.w3.org/2000/svg')
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
    path.setAttributeNS(null, 'd', val.path)
    svg.appendChild(path)
    container.appendChild(svg)

    // return the svg box coordinates
    const box = svg.getBBox()
    val.box = {
      x: Math.round(box.x),
      y: Math.round(box.y),
      width: Math.round(box.width),
      height: Math.round(box.height)
    }

    // remove our svg element
    svg.remove()
  }
  return data
})()
