const { Router } = require('express')
const router = Router()
const asyncHandler = require('express-async-handler')
const clientIsConnected = require('../middlewares/client-connected')

router.get('/get-status', clientIsConnected, asyncHandler(async (req,res) => {
  
  res.status(200).json({
    status:'success',
    message:`Client is connected`
  })
}))


module.exports = router