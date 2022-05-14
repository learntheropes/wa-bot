const asyncHandler = require('express-async-handler')
const client = require('../whatsapp')

const clientConnected = asyncHandler(async (req, res, next) => {

    let state 
    try {
        state = await client.getState() 
    } catch (error) {
        state = null
    }

    if (!state) {
        res.status(500).json({
            status: "failed",
            message: "Client not connected"            
        })
        return      
    } else if (state && state !== 'CONNECTED') {
        res.status(500).json({
            status: "failed",
            message: `Client is ${state}`           
        })
        return          
    }

    next()
})

module.exports = clientConnected