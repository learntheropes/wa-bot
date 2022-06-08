const asyncHandler = require('express-async-handler')
const wa = require('../lib/whatsapp')

const clientConnected = asyncHandler(async (req, res, next) => {

    let state 
    try {
        state = await wa.getState() 
    } catch (error) {
        state = null
    }

    if (!state) {
        res.status(500).json({
            status: "error",
            message: "Client not connected"            
        })
        return      
    } else if (state && state !== 'CONNECTED') {
        res.status(500).json({
            status: "error",
            message: `Client is ${state}`           
        })
        return          
    }

    next()
})

module.exports = clientConnected