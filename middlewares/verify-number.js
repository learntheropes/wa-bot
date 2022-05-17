const asyncHandler = require('express-async-handler')
const client = require('../whatsapp')

const verifyNumber = asyncHandler(async (req, res, next) => {

    const numberId = await client.getNumberId(req.body.recipient)

    if (!numberId) {
        res.status(500).json({
            status: "error",
            message: "Not a valid Whatsapp number"            
        })
        return         
    }

    next()
})

module.exports = verifyNumber