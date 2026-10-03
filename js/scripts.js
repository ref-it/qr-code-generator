// qrcode-svg emits inline style attributes, which the Content-Security-Policy blocks
function buildSvg(extraOptions) {
    return new QRCode(Object.assign({}, qrOptions, extraOptions)).svg()
        .replace(/ style="fill:([^;"]+);shape-rendering:crispEdges;"/g, ' fill="$1" shape-rendering="crispEdges"')
}

function validateFields() {
    var fields = [
        {id: 'message', error: 'errorMessage', valid: value => value !== ''},
        {id: 'dimensions', error: 'errorDimensions', valid: value => /^\d+$/.test(value) && value >= 32 && value <= 2048},
        {id: 'padding', error: 'errorPadding', valid: value => /^\d+$/.test(value) && value <= 20}
    ]
    var firstInvalid = null
    clearErrors()
    fields.forEach(field => {
        var input = document.getElementById(field.id)
        if (field.valid(input.value)) return
        input.classList.add('is-invalid')
        input.setAttribute('aria-invalid', 'true')
        document.getElementById(field.id + '-error').textContent = t(field.error)
        firstInvalid = firstInvalid || input
    })
    if (firstInvalid) firstInvalid.focus()
    return !firstInvalid
}

function generateQrCode() {
    var message = document.getElementById('message')
    if (!validateFields()) return
    var size = parseInt(document.getElementById('dimensions').value, 10) || 256
    qrOptions = {
        content: message.value,
        width: size,
        height: size,
        padding: parseInt(document.getElementById('padding').value, 10) || 0,
        color: document.getElementById('color').value,
        background: document.getElementById('background-transparent').checked ? 'transparent' : document.getElementById('background-color').value,
        join: true
    }
    var box = document.getElementById('box-qr')
    box.innerHTML = buildSvg({xmlDeclaration: false, container: 'svg-viewbox'})
    qrcode = box.firstElementChild
    qrcode.setAttribute('role', 'img')
    qrcode.setAttribute('aria-label', t('qrLabel') + message.value)
    document.getElementById('btn-download').disabled = false
    // clear first so that screen readers announce repeated generations again
    var statusSr = document.getElementById('status-sr')
    statusSr.textContent = ''
    setTimeout(() => { statusSr.textContent = t('statusGenerated') }, 100)
}

function saveBlob(blob, filename) {
    var fileURL = window.URL.createObjectURL(blob)
    var fileLink = document.createElement('a')
    fileLink.href = fileURL
    fileLink.setAttribute('download', filename)
    document.body.appendChild(fileLink)
    fileLink.click()
    fileLink.remove()
    setTimeout(() => window.URL.revokeObjectURL(fileURL), 1000)
}

function downloadImage(format) {
    var svgBlob = new Blob([buildSvg()], {type: 'image/svg+xml'})
    if (format === 'svg') {
        saveBlob(svgBlob, 'qr-code.svg')
        return
    }
    var size = qrOptions.width
    var svgURL = window.URL.createObjectURL(svgBlob)
    var image = new Image()
    image.onload = () => {
        var canvas = document.createElement('canvas')
        canvas.width = size
        canvas.height = size
        var context = canvas.getContext('2d')
        context.drawImage(image, 0, 0, size, size)
        window.URL.revokeObjectURL(svgURL)
        canvas.toBlob(blob => saveBlob(blob, 'qr-code.' + format), 'image/' + format, 0.95)
    }
    image.src = svgURL
}

document.getElementById('form').addEventListener("submit", e => { e.preventDefault(); generateQrCode() });
document.getElementById('background-transparent').addEventListener("change", e => { document.getElementById('background-color').disabled = e.target.checked });
document.getElementById('btn-download').addEventListener("click", () => downloadImage(document.getElementById('download-format').value));
