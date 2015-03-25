document.addEventListener('DOMContentLoaded', init)

var zoom = 10
var lastPPM = {width: 0, height: 0, pixels: []}

function init() {
  var dropArea = window

  // PreventDefault to prevent the browser from capturing the drop
  // event (and ask to save the PPM file or open it with the default
  // viewer).
  dropArea.addEventListener('dragenter', (e) => {e.preventDefault()})
  dropArea.addEventListener('dragover', (e) => {e.preventDefault()})
  dropArea.addEventListener('drop', (e) => {
    e.preventDefault()

    var file = e.dataTransfer.files[0]
    if (file == null) return error('No file was dropped')

    var reader = new FileReader()
    reader.onload = () => {
      lastPPM = parse(reader.result)
      display(lastPPM)
    }
    reader.onerror = error
    reader.readAsText(file)
  })

  var $zoom = document.getElementById('zoom')
  $zoom.addEventListener('input', (e) => {
    zoom = $zoom.value
    display(lastPPM)
  })

  // Get zoom value from DOM.  The browser can save the set value from
  // a previous session, so it’s not always set to the default value.
  zoom = $zoom.value
}

function error(e) { console.error(e) }

// PPM String -> PPM object
function parse(ppmString) {
  // Remove lines comment lines beginning with '#', then rejoin.
  var lines = ppmString.split('\n')
    .filter(l => !l.match(/^#/))
    .join('\n')

  var whitespace = /[ \t\r\n]+/
  var fields = lines.split(whitespace)

  var [magic, width, height, maxVal, ...pixelData] = fields

  if (magic !== 'P3')
    return error(`Expected 'P3' magic number at the beginning of the file, got ${magic}`)

  width = parseInt(width, 10)
  if (isNaN(width))
    return error(`Expected a decimal value for width, got ${width}`)

  height = parseInt(height, 10)
  if (isNaN(height))
    return error(`Expected a decimal value for height, got ${height}`)

  maxVal = parseInt(maxVal, 10)
  if (isNaN(maxVal) || maxVal < 0 || maxVal >= 65536)
    return error(`Expected a positive decimal less than 65536 for maximum color value, got ${maxVal}`)

  var pixels = []
  var idx, r, g, b
  for (var y = 0; y < height; ++y) {
    for (var x = 0; x < width; ++x) {
      idx = 3 * (y * width + x)

      r = parseInt(pixelData[idx])
      if (isNaN(r)) return error(`Expected a decimal value for red component, got ${r}`)
      g = parseInt(pixelData[idx + 1])
      if (isNaN(g)) return error(`Expected a decimal value for green component, got ${g}`)
      b = parseInt(pixelData[idx + 2])
      if (isNaN(b)) return error(`Expected a decimal value for blue component, got ${b}`)

      pixels.push([r,g,b].map(p => p / maxVal))
    }
  }

  return {width, height, pixels}
}

// Display PPM object to canvas
function display(ppm) {
  var $canvas = document.getElementById('display')
  var c = $canvas.getContext('2d')
  $canvas.width = zoom * ppm.width
  $canvas.height = zoom * ppm.height
  c.scale(zoom, zoom)

  var idx, r, g, b
  for (var y = 0; y < ppm.height; ++y)
    for (var x = 0; x < ppm.width; ++x) {
      idx = y * ppm.width + x

      ;[r, g, b] = ppm.pixels[idx].map(p => Math.floor(p * 255))
      c.fillStyle = `rgb(${r},${g},${b})`
      c.fillRect(x, y, 1, 1)
    }
}
