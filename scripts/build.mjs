// Copies the app and the npm assets it needs into dist/, so that node_modules does not have to be served.
import { cpSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'

const nm = 'node_modules'
const out = 'dist'

rmSync(out, { recursive: true, force: true })
mkdirSync(out, { recursive: true })

for (const path of ['css', 'js', '.htaccess']) {
    cpSync(path, `${out}/${path}`, { recursive: true })
}

const copy = (from, to) => cpSync(`${nm}/${from}`, `${out}/vendor/${to}`, { recursive: true })

copy('bootstrap/dist/css/bootstrap.min.css', 'bootstrap/bootstrap.min.css')
copy('bootstrap/LICENSE', 'bootstrap/LICENSE')

copy('qrcode-svg/dist/qrcode.min.js', 'qrcode-svg/qrcode.min.js')
copy('qrcode-svg/LICENSE', 'qrcode-svg/LICENSE')

copy('lucide-static/LICENSE', 'icons/LICENSE')
for (const icon of ['qr-code', 'download']) {
    copy(`lucide-static/icons/${icon}.svg`, `icons/${icon}.svg`)
}

copy('@fontsource/adwaita-sans/LICENSE', 'adwaita-sans/LICENSE')
for (const weight of [400, 700]) {
    copy(`@fontsource/adwaita-sans/latin-${weight}.css`, `adwaita-sans/latin-${weight}.css`)
    for (const ext of ['woff2', 'woff']) {
        const file = `adwaita-sans-latin-${weight}-normal.${ext}`
        copy(`@fontsource/adwaita-sans/files/${file}`, `adwaita-sans/files/${file}`)
    }
}

const html = readFileSync('index.html', 'utf8')
    .replaceAll('node_modules/bootstrap/dist/css/', 'vendor/bootstrap/')
    .replaceAll('node_modules/@fontsource/adwaita-sans/', 'vendor/adwaita-sans/')
    .replaceAll('node_modules/lucide-static/icons/', 'vendor/icons/')
    .replaceAll('node_modules/qrcode-svg/dist/', 'vendor/qrcode-svg/')
if (html.includes('node_modules')) {
    throw new Error('index.html still references node_modules')
}
writeFileSync(`${out}/index.html`, html)
