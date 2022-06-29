const asyncHandler = require('express-async-handler')
const client = require('../lib/whatsapp')

const verifyNumber = asyncHandler(async (req, res, next) => {

    const numberId = await client.getNumberId(req.body.recipient)

    if (!numberId) {
        res.status(500).json({
            status: "error",
            message: "whatsappInvalidNumber"            
        })
        return         
    }

    next()
})

module.exports = verifyNumber