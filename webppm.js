var _slicedToArray = function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { var _arr = []; for (var _iterator = arr[Symbol.iterator](), _step; !(_step = _iterator.next()).done;) { _arr.push(_step.value); if (i && _arr.length === i) break; } return _arr; } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } };

var _toArray = function (arr) { return Array.isArray(arr) ? arr : Array.from(arr); };

document.addEventListener("DOMContentLoaded", init);

var zoom = 10;
var lastPPM = { width: 0, height: 0, pixels: [] };

function init() {
  var dropArea = window;

  // PreventDefault to prevent the browser from capturing the drop
  // event (and ask to save the PPM file or open it with the default
  // viewer).
  dropArea.addEventListener("dragenter", function (e) {
    e.preventDefault();
  });
  dropArea.addEventListener("dragover", function (e) {
    e.preventDefault();
  });
  dropArea.addEventListener("drop", function (e) {
    e.preventDefault();

    var file = e.dataTransfer.files[0];
    if (file == null) return error("No file was dropped");

    var reader = new FileReader();
    reader.onload = function () {
      lastPPM = parse(reader.result);
      display(lastPPM);
    };
    reader.onerror = error;
    reader.readAsText(file);
  });

  var $zoom = document.getElementById("zoom");
  $zoom.addEventListener("input", function (e) {
    zoom = $zoom.value;
    display(lastPPM);
  });

  // Get zoom value from DOM.  The browser can save the set value from
  // a previous session, so it’s not always set to the default value.
  zoom = $zoom.value;
}

function error(e) {
  console.error(e);
}

// PPM String -> PPM object
function parse(ppmString) {
  // Remove lines comment lines beginning with '#', then rejoin.
  var lines = ppmString.split("\n").filter(function (l) {
    return !l.startsWith("#");
  }).join("\n");

  var whitespace = /[ \t\r\n]+/;
  var fields = lines.split(whitespace);

  var _fields = _toArray(fields);

  var magic = _fields[0];
  var width = _fields[1];
  var height = _fields[2];
  var maxVal = _fields[3];

  var pixelData = _fields.slice(4);

  if (magic !== "P3") return error("Expected 'P3' magic number at the beginning of the file, got " + magic);

  width = parseInt(width, 10);
  if (isNaN(width)) return error("Expected a decimal value for width, got " + width);

  height = parseInt(height, 10);
  if (isNaN(height)) return error("Expected a decimal value for height, got " + height);

  maxVal = parseInt(maxVal, 10);
  if (isNaN(maxVal) || maxVal < 0 || maxVal >= 65536) return error("Expected a positive decimal less than 65536 for maximum color value, got " + maxVal);

  var pixels = [];
  var idx, r, g, b;
  for (var y = 0; y < height; ++y) {
    for (var x = 0; x < width; ++x) {
      idx = 3 * (y * width + x);

      r = parseInt(pixelData[idx]);
      if (isNaN(r)) return error("Expected a decimal value for red component, got " + r);
      g = parseInt(pixelData[idx + 1]);
      if (isNaN(g)) return error("Expected a decimal value for green component, got " + g);
      b = parseInt(pixelData[idx + 2]);
      if (isNaN(b)) return error("Expected a decimal value for blue component, got " + b);

      pixels.push([r, g, b].map(function (p) {
        return p / maxVal;
      }));
    }
  }

  return { width: width, height: height, pixels: pixels };
}

// Display PPM object to canvas
function display(ppm) {
  var $canvas = document.getElementById("display");
  var c = $canvas.getContext("2d");
  $canvas.width = zoom * ppm.width;
  $canvas.height = zoom * ppm.height;
  c.scale(zoom, zoom);

  var idx, r, g, b;
  for (var y = 0; y < ppm.height; ++y) for (var x = 0; x < ppm.width; ++x) {
    idx = y * ppm.width + x;
    var _ref = ppm.pixels[idx].map(function (p) {
      return Math.floor(p * 255);
    });

    var _ref2 = _slicedToArray(_ref, 3);

    r = _ref2[0];
    g = _ref2[1];
    b = _ref2[2];

    c.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
    c.fillRect(x, y, 1, 1);
  }
}

//# sourceMappingURL=data:application/json;base64,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QUMsQ0FBQyxHQUFHLENBQUMsVUFBQSxDQUFDO2FBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDO0tBQUEsQ0FBQzs7OztBQUF4RCxLQUFDO0FBQUUsS0FBQztBQUFFLEtBQUM7O0FBQ1QsS0FBQyxDQUFDLFNBQVMsWUFBVSxDQUFDLFNBQUksQ0FBQyxTQUFJLENBQUMsTUFBRyxDQUFBO0FBQ25DLEtBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUE7R0FDdkI7Q0FDSiIsImZpbGUiOiJ3ZWJwcG0uanMiLCJzb3VyY2VzQ29udGVudCI6WyJkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgaW5pdClcblxudmFyIHpvb20gPSAxMFxudmFyIGxhc3RQUE0gPSB7d2lkdGg6IDAsIGhlaWdodDogMCwgcGl4ZWxzOiBbXX1cblxuZnVuY3Rpb24gaW5pdCgpIHtcbiAgdmFyIGRyb3BBcmVhID0gd2luZG93XG5cbiAgLy8gUHJldmVudERlZmF1bHQgdG8gcHJldmVudCB0aGUgYnJvd3NlciBmcm9tIGNhcHR1cmluZyB0aGUgZHJvcFxuICAvLyBldmVudCAoYW5kIGFzayB0byBzYXZlIHRoZSBQUE0gZmlsZSBvciBvcGVuIGl0IHdpdGggdGhlIGRlZmF1bHRcbiAgLy8gdmlld2VyKS5cbiAgZHJvcEFyZWEuYWRkRXZlbnRMaXN0ZW5lcignZHJhZ2VudGVyJywgKGUpID0+IHtlLnByZXZlbnREZWZhdWx0KCl9KVxuICBkcm9wQXJlYS5hZGRFdmVudExpc3RlbmVyKCdkcmFnb3ZlcicsIChlKSA9PiB7ZS5wcmV2ZW50RGVmYXVsdCgpfSlcbiAgZHJvcEFyZWEuYWRkRXZlbnRMaXN0ZW5lcignZHJvcCcsIChlKSA9PiB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpXG5cbiAgICB2YXIgZmlsZSA9IGUuZGF0YVRyYW5zZmVyLmZpbGVzWzBdXG4gICAgaWYgKGZpbGUgPT0gbnVsbCkgcmV0dXJuIGVycm9yKCdObyBmaWxlIHdhcyBkcm9wcGVkJylcblxuICAgIHZhciByZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpXG4gICAgcmVhZGVyLm9ubG9hZCA9ICgpID0+IHtcbiAgICAgIGxhc3RQUE0gPSBwYXJzZShyZWFkZXIucmVzdWx0KVxuICAgICAgZGlzcGxheShsYXN0UFBNKVxuICAgIH1cbiAgICByZWFkZXIub25lcnJvciA9IGVycm9yXG4gICAgcmVhZGVyLnJlYWRBc1RleHQoZmlsZSlcbiAgfSlcblxuICB2YXIgJHpvb20gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnem9vbScpXG4gICR6b29tLmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgKGUpID0+IHtcbiAgICB6b29tID0gJHpvb20udmFsdWVcbiAgICBkaXNwbGF5KGxhc3RQUE0pXG4gIH0pXG5cbiAgLy8gR2V0IHpvb20gdmFsdWUgZnJvbSBET00uICBUaGUgYnJvd3NlciBjYW4gc2F2ZSB0aGUgc2V0IHZhbHVlIGZyb21cbiAgLy8gYSBwcmV2aW91cyBzZXNzaW9uLCBzbyBpdOKAmXMgbm90IGFsd2F5cyBzZXQgdG8gdGhlIGRlZmF1bHQgdmFsdWUuXG4gIHpvb20gPSAkem9vbS52YWx1ZVxufVxuXG5mdW5jdGlvbiBlcnJvcihlKSB7IGNvbnNvbGUuZXJyb3IoZSkgfVxuXG4vLyBQUE0gU3RyaW5nIC0+IFBQTSBvYmplY3RcbmZ1bmN0aW9uIHBhcnNlKHBwbVN0cmluZykge1xuICAvLyBSZW1vdmUgbGluZXMgY29tbWVudCBsaW5lcyBiZWdpbm5pbmcgd2l0aCAnIycsIHRoZW4gcmVqb2luLlxuICB2YXIgbGluZXMgPSBwcG1TdHJpbmcuc3BsaXQoJ1xcbicpXG4gICAgLmZpbHRlcihsID0+ICFsLnN0YXJ0c1dpdGgoJyMnKSlcbiAgICAuam9pbignXFxuJylcblxuICB2YXIgd2hpdGVzcGFjZSA9IC9bIFxcdFxcclxcbl0rL1xuICB2YXIgZmllbGRzID0gbGluZXMuc3BsaXQod2hpdGVzcGFjZSlcblxuICB2YXIgW21hZ2ljLCB3aWR0aCwgaGVpZ2h0LCBtYXhWYWwsIC4uLnBpeGVsRGF0YV0gPSBmaWVsZHNcblxuICBpZiAobWFnaWMgIT09ICdQMycpXG4gICAgcmV0dXJuIGVycm9yKGBFeHBlY3RlZCAnUDMnIG1hZ2ljIG51bWJlciBhdCB0aGUgYmVnaW5uaW5nIG9mIHRoZSBmaWxlLCBnb3QgJHttYWdpY31gKVxuXG4gIHdpZHRoID0gcGFyc2VJbnQod2lkdGgsIDEwKVxuICBpZiAoaXNOYU4od2lkdGgpKVxuICAgIHJldHVybiBlcnJvcihgRXhwZWN0ZWQgYSBkZWNpbWFsIHZhbHVlIGZvciB3aWR0aCwgZ290ICR7d2lkdGh9YClcblxuICBoZWlnaHQgPSBwYXJzZUludChoZWlnaHQsIDEwKVxuICBpZiAoaXNOYU4oaGVpZ2h0KSlcbiAgICByZXR1cm4gZXJyb3IoYEV4cGVjdGVkIGEgZGVjaW1hbCB2YWx1ZSBmb3IgaGVpZ2h0LCBnb3QgJHtoZWlnaHR9YClcblxuICBtYXhWYWwgPSBwYXJzZUludChtYXhWYWwsIDEwKVxuICBpZiAoaXNOYU4obWF4VmFsKSB8fCBtYXhWYWwgPCAwIHx8IG1heFZhbCA+PSA2NTUzNilcbiAgICByZXR1cm4gZXJyb3IoYEV4cGVjdGVkIGEgcG9zaXRpdmUgZGVjaW1hbCBsZXNzIHRoYW4gNjU1MzYgZm9yIG1heGltdW0gY29sb3IgdmFsdWUsIGdvdCAke21heFZhbH1gKVxuXG4gIHZhciBwaXhlbHMgPSBbXVxuICB2YXIgaWR4LCByLCBnLCBiXG4gIGZvciAodmFyIHkgPSAwOyB5IDwgaGVpZ2h0OyArK3kpIHtcbiAgICBmb3IgKHZhciB4ID0gMDsgeCA8IHdpZHRoOyArK3gpIHtcbiAgICAgIGlkeCA9IDMgKiAoeSAqIHdpZHRoICsgeClcblxuICAgICAgciA9IHBhcnNlSW50KHBpeGVsRGF0YVtpZHhdKVxuICAgICAgaWYgKGlzTmFOKHIpKSByZXR1cm4gZXJyb3IoYEV4cGVjdGVkIGEgZGVjaW1hbCB2YWx1ZSBmb3IgcmVkIGNvbXBvbmVudCwgZ290ICR7cn1gKVxuICAgICAgZyA9IHBhcnNlSW50KHBpeGVsRGF0YVtpZHggKyAxXSlcbiAgICAgIGlmIChpc05hTihnKSkgcmV0dXJuIGVycm9yKGBFeHBlY3RlZCBhIGRlY2ltYWwgdmFsdWUgZm9yIGdyZWVuIGNvbXBvbmVudCwgZ290ICR7Z31gKVxuICAgICAgYiA9IHBhcnNlSW50KHBpeGVsRGF0YVtpZHggKyAyXSlcbiAgICAgIGlmIChpc05hTihiKSkgcmV0dXJuIGVycm9yKGBFeHBlY3RlZCBhIGRlY2ltYWwgdmFsdWUgZm9yIGJsdWUgY29tcG9uZW50LCBnb3QgJHtifWApXG5cbiAgICAgIHBpeGVscy5wdXNoKFtyLGcsYl0ubWFwKHAgPT4gcCAvIG1heFZhbCkpXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHt3aWR0aCwgaGVpZ2h0LCBwaXhlbHN9XG59XG5cbi8vIERpc3BsYXkgUFBNIG9iamVjdCB0byBjYW52YXNcbmZ1bmN0aW9uIGRpc3BsYXkocHBtKSB7XG4gIHZhciAkY2FudmFzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Rpc3BsYXknKVxuICB2YXIgYyA9ICRjYW52YXMuZ2V0Q29udGV4dCgnMmQnKVxuICAkY2FudmFzLndpZHRoID0gem9vbSAqIHBwbS53aWR0aFxuICAkY2FudmFzLmhlaWdodCA9IHpvb20gKiBwcG0uaGVpZ2h0XG4gIGMuc2NhbGUoem9vbSwgem9vbSlcblxuICB2YXIgaWR4LCByLCBnLCBiXG4gIGZvciAodmFyIHkgPSAwOyB5IDwgcHBtLmhlaWdodDsgKyt5KVxuICAgIGZvciAodmFyIHggPSAwOyB4IDwgcHBtLndpZHRoOyArK3gpIHtcbiAgICAgIGlkeCA9IHkgKiBwcG0ud2lkdGggKyB4XG5cbiAgICAgIDtbciwgZywgYl0gPSBwcG0ucGl4ZWxzW2lkeF0ubWFwKHAgPT4gTWF0aC5mbG9vcihwICogMjU1KSlcbiAgICAgIGMuZmlsbFN0eWxlID0gYHJnYigke3J9LCR7Z30sJHtifSlgXG4gICAgICBjLmZpbGxSZWN0KHgsIHksIDEsIDEpXG4gICAgfVxufVxuIl19