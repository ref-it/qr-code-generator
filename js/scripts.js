function generateQrCode() {
    qrcode = new QRCode({
        msg: document.getElementById('message').value,
        dim: document.getElementById('dimensions').value,
        pad: document.getElementById('padding').value,
        pal: !document.getElementById('background-transparent').checked ? [document.getElementById('color').value, document.getElementById('background-color').value] : [document.getElementById('color').value]
    })
    document.getElementById("box-qr").innerHTML = '';
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

document.getElementById('btn-generate').addEventListener("click", () => generateQrCode());
document.getElementById('btn-download-svg').addEventListener("click", () => downloadSVG());
