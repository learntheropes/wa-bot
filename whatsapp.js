const { Client, LocalAuth } = require('whatsapp-web.js')
var qrcode = require('qrcode-terminal')
const { q, client } = require('./lib/fauna')

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
    console.log('READY')
    await client.query(
        q.Update(
            q.Ref(q.Collection('status'), '332036570083229762'),
            { data: { state: 'CONNECTED' }},
        )
    )
})

wa.on('change_state', state => {
    console.log('CHANGE STATE', state )
})

wa.on('disconnected', (reason) => {
    console.log('Client was logged out', reason)
})

module.exports = wa