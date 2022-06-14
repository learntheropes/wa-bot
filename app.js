const { updateFaunaStatus } = require('./lib/fauna')
const { auth0GetToken, auth0UpdateGateway} = require('./lib/auth0')
const { vercelUpdateEnv, vercelDeploy } = require('./lib/vercel')
const wa = require('./lib/whatsapp')
const ngrok = require('ngrok')
const express = require('express')
const dotenv = require('dotenv')
dotenv.config()

const port = 8000

const sleep = ms => new Promise(r => setTimeout(r, ms))

ngrok.connect({ port, authtoken: process.env.NGROK_TOKEN }).then(async ngrokUrl => {
    try {
        const access_token = await auth0GetToken()
        await auth0UpdateGateway(ngrokUrl, access_token)

        await vercelUpdateEnv(ngrokUrl)
        await vercelDeploy()

        wa.initialize()

        await sleep(1000 * 30)
        
        const state = await wa.getState() 

        await updateFaunaStatus(state)
    } catch (error) {
        console.log(error)
    }
}).catch(error => {
    console.log(error)
})

process.on("SIGINT", async () => {
    console.log("(SIGINT) Shutting down...")
    await wa.destroy()
    console.log('DISCONNECTED: ')
    await updateFaunaStatus('DISCONNECTED')
    process.exit(0)
})

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const login = require('./routes/login')
const codeSend = require('./routes/code-send')
const codeVerify = require('./routes/code-verify')
const getStatus = require('./routes/get-status')

app.use(login)
app.use(codeSend)
app.use(codeVerify)
app.use(getStatus)

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})

