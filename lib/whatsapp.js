const { Client, LocalAuth } = require('whatsapp-web.js')
const QRCode = require('qrcode')
const { updateFaunaStatus } = require('./fauna')
const { sendTelegram } = require('./telegram')

const sleep = ms => new Promise(r => setTimeout(r, ms))

const wa = new Client({
    puppeteer: {
        headless: true,
        args: ['--no-sandbox']
    },
    authStrategy: new LocalAuth({
        dataPath: './temp/'
    }),
})

wa.on('qr', async (qr) => {
    const qrcode = await QRCode.toString(qr,{
        type: 'terminal',
        small: true
    })
    console.log(qrcode)
    await sendTelegram(qr)
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
    await sleep(1000 * 5)
    wa.initialize()
})

module.exports = wa