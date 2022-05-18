const { Client, LocalAuth } = require('whatsapp-web.js')
var qrcode = require('qrcode-terminal')

const wa = new Client({
    puppeteer: { headless: true },
    authStrategy: new LocalAuth({ dataPath: './temp/'}),
})

wa.on('qr', (qr) => {
    console.log('QR RECEIVED', qr)
    qrcode.generate(qr, { small: true })
    console.log(qrcode)
})

wa.on('authenticated', () => {
    console.log('AUTHENTICATED')
})

wa.on('auth_failure', msg => {
    console.error('AUTHENTICATION FAILURE', msg)
})

wa.on('ready', () => {
    console.log('READY')
})

wa.on('change_state', state => {
    console.log('CHANGE STATE', state )
})

wa.on('disconnected', (reason) => {
    console.log('Client was logged out', reason)
})

module.exports = wa