const { Router } = require('express')
const router = Router()
const asyncHandler = require('express-async-handler')
const wa = require('../lib/whatsapp')
const auth = require('../middlewares/authentication')
const clientIsConnected = require('../middlewares/client-connected')
const numberIsRegistered = require('../middlewares/verify-number')

router.post('/message-send', auth, clientIsConnected, numberIsRegistered, asyncHandler(async (req,res) => {

    const { recipient, message } = req.body
    const phone = `${recipient.replace('+','')}@c.us`

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