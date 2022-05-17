const { Client, LocalAuth } = require('whatsapp-web.js')
var qrcode = require('qrcode-terminal')

const client = new Client({
    puppeteer: { headless: true },
    authStrategy: new LocalAuth({ dataPath: './temp/'}),
})

client.on('qr', (qr) => {
    console.log('QR RECEIVED', qr)
    qrcode.generate(qr, { small: true })
    console.log(qrcode)
})

client.on('authenticated', () => {
    console.log('AUTHENTICATED')
})

client.on('auth_failure', msg => {
    console.error('AUTHENTICATION FAILURE', msg)
})

client.on('ready', () => {
    console.log('READY')
})

client.on('change_state', state => {
    console.log('CHANGE STATE', state )
})

client.on('disconnected', (reason) => {
    console.log('Client was logged out', reason)
})

module.exports = client