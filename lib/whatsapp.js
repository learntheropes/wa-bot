const { Client, LocalAuth } = require('whatsapp-web.js')
var qrcode = require('qrcode-terminal')
const { updateFaunaStatus } = require('./fauna')

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

wa.on('ready', async () => {
    console.log('CONNECTED')
    await updateFaunaStatus('CONNECTED')
})

wa.on('change_state', async (state) => {
    console.log(state)
    await updateFaunaStatus(state)
})

wa.on('disconnected', async (reason) => {
    console.log('DISCONNECTED: ', reason)
    await updateFaunaStatus('DISCONNECTED')
})

module.exports = wa