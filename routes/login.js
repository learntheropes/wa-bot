const { Router } = require('express')
const router = Router()
const asyncHandler = require('express-async-handler')
const client = require('../whatsapp')
const clientIsConnected = require('../middlewares/client-connected')
const numberIsRegistered = require('../middlewares/verify-number')
const authenticateAuth0Token = require('../middlewares/authentication-auth0')

router.post('/login', authenticateAuth0Token, clientIsConnected, numberIsRegistered, asyncHandler(async (req,res) => {

    const phone = `${req.body.recipient.replace('+','')}@c.us`
    const message = req.body.body

    const response = await client.sendMessage(phone,message)

    if (response.id.fromMe) {
        res.status(200).json({
            status:'success',
            message:`Message successfully sent to ${req.body.recipient}`
        })
    }
}))

module.exports = router