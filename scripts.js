function generateQrCode() {
    text = document.getElementById('text-input').value
    qrcode = new QRCode(text)
    document.getElementById("box-qr").appendChild(qrcode);
}

function downloadSVG() {
    var fileURL = window.URL.createObjectURL(new Blob([qrcode.outerHTML], {type: 'image/svg+xml'}))
    var fileLink = document.createElement('a')
    fileLink.href = fileURL
    fileLink.setAttribute('download', 'qr-code.svg')
    document.body.appendChild(fileLink)
    fileLink.click()
}
