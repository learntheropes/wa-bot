const { Router } = require('express')
const router = Router()
const asyncHandler = require('express-async-handler')
const wa = require('../whatsapp')
const clientIsConnected = require('../middlewares/client-connected')
const numberIsRegistered = require('../middlewares/verify-number')
const auth = require('../middlewares/authentication-auth0')

router.post('/login', auth, clientIsConnected, numberIsRegistered, asyncHandler(async (req,res) => {

    const phone = `${req.body.recipient.replace('+','')}@c.us`
    const code = req.body.body
    const message = `Tu código de acceso es: *${code}*`

    const response = await wa.sendMessage(phone,message)

    if (response.id.fromMe) {
        res.status(200).json({
            status:'success',
            message:`Message successfully sent to ${req.body.recipient}`
        })
    }
}))

module.exports = router