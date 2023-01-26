const { Router } = require('express')
const router = Router()
const asyncHandler = require('express-async-handler')
const wa = require('../lib/whatsapp')
const auth = require('../middlewares/authentication')
const clientIsConnected = require('../middlewares/client-connected')
const numberIsRegistered = require('../middlewares/verify-number')
const { q, client } = require('../lib/fauna')

router.post('/code-send', auth, clientIsConnected, numberIsRegistered, asyncHandler(async (req,res) => {

    const { recipient } = req.body
    const phone = `${recipient.replace('+','')}@c.us`
    const code = Math.floor(100000 + Math.random() * 900000)
    const message = `Tu código de verificación es: *${code}*`

    await client.query(
        q.Create(
            q.Collection('verifications'),
            { data: { recipient, code }},
        )
    )

    const response = await wa.sendMessage(phone,message)

    if (response.id.fromMe) {
        res.status(200).json({
            status:'success',
            message:`Message successfully sent to ${recipient}`
        })
    } else {
        res.status(500).json({
            status:'error'
        }) 
    }
}))

module.exports = router