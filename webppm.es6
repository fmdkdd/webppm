document.addEventListener('DOMContentLoaded', init)

var zoom
var $canvas
var ctxt

function init() {
  $canvas = document.getElementById('display')
  ctxt = $canvas.getContext('2d')

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
    reader.onload = () => {display(reader.result)}
    reader.onerror = error
    reader.readAsText(file)
  })

  var $zoom = document.getElementById('zoom')
  $zoom.addEventListener('input', _ => {
    zoom = $zoom.value
    $canvas.style.width = `${$canvas.width * zoom}px`
    $canvas.style.height = `${$canvas.height * zoom}px`
  })

  // Get zoom value from DOM.  The browser can save the set value from
  // a previous session, so it’s not always set to the default value.
  zoom = $zoom.value
}

function error(e) { console.error(e) }


// Parse and display PPM object to canvas
function display(ppmString) {
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

  // Prepare canvas
  $canvas.width = width
  $canvas.height = height
  $canvas.style.width = `${$canvas.width * zoom}px`
  $canvas.style.height = `${$canvas.height * zoom}px`

  var imgData = ctxt.createImageData(width, height)
  var pixels = imgData.data

  var to255 = 255 / maxVal
  var pdi, pi, r, g, b, y, x
  for (y = 0, pdi = 0, pi = 0; y < height; ++y) {
    for (x = 0; x < width; ++x, pdi += 3, pi += 4) {
      r = parseInt(pixelData[pdi])
      if (isNaN(r)) return error(`Expected a decimal value for red component, got ${r}`)
      g = parseInt(pixelData[pdi + 1])
      if (isNaN(g)) return error(`Expected a decimal value for green component, got ${g}`)
      b = parseInt(pixelData[pdi + 2])
      if (isNaN(b)) return error(`Expected a decimal value for blue component, got ${b}`)

      r *= to255
      g *= to255
      b *= to255
      pixels.set([r,g,b,255], pi)
    }
  }

  ctxt.putImageData(imgData, 0, 0)
}
