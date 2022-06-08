const fm = require('./lib/fm')
const { q, client } = require('./lib/fauna')
const ngrok = require('ngrok')
const axios = require('axios').default
const express = require('express')
const bodyParser = require('body-parser')
const wa = require('./whatsapp')
const dotenv = require('dotenv')
dotenv.config()

const port = 8000

const sleep = ms => new Promise(r => setTimeout(r, ms))

ngrok.connect({ port, authtoken: process.env.NGROK_TOKEN }).then(async url => {
    try {
        const { data: { access_token }} = await axios.post(`https://${process.env.AUTH0_URL}/oauth/token`, {
            grant_type: 'client_credentials',
            client_id: process.env.AUTH0_CLIENT_ID,
            client_secret: process.env.AUTH0_CLIENT_SECRET,
            audience: `https://${process.env.AUTH0_URL}/api/v2/`
        }, {
            headers: {
                'content-type': 'application/json'
            }
        })
        const { data: { options : { gateway_url }}} = await axios.patch(`https://${process.env.AUTH0_URL}/api/v2/connections/${process.env.GATEWAY_ID}`, {
            "options":{
                "provider": "sms_gateway",
                "gateway_url": `${url}/login`,
                "from": process.env.PHONE_NUMBER,
                "totp":{
                    "length":6,
                    "time_step":180
                },
                "syntax":"md_with_macros",
                "template":"@@password@@",
                "disable_signup":false,
                "messaging_service_sid":null,
                "brute_force_protection":true,
                "forward_req_info":true,
                "gateway_authentication": {
                    "method": "bearer",
                    "subject": "urn:Auth0",
                    "audience": "urn:wabot",
                    "secret": process.env.CUSTOM_TOKEN_SECRET,
                    "secret_base64_encoded": false
                }
            },
            "is_domain_connection":false,
            "enabled_clients":[
                process.env.ENABLED_CLIENT
            ]        
        },{
            headers: {
                'Content-Type': 'application/json',
                'authorization': `Bearer ${access_token}`
            }
        })
        console.log(`Auth0 URL ${url} updated: ${url + '/login' === gateway_url}`)

        const { data: { build_settings: { env }}} = await axios.get(`https://api.netlify.com/api/v1/sites/${process.env.NETLIFY_SITE_ID}`, {
            headers: {
                authorization: `Bearer ${process.env.NETLIFY_TOKEN}`
            }
        })
        env.WA_BOT_URL = url
        const { data } = await axios.put(`https://api.netlify.com/api/v1/sites/${process.env.NETLIFY_SITE_ID}`, {
            build_settings: { env }
        }, {
            headers: {
                'authorization': `Bearer ${process.env.NETLIFY_TOKEN}`,
                'Content-Type': 'application/json'
            }            
        })
        const { data: { build_settings: { env: { WA_BOT_URL }}}} = await axios.get(`https://api.netlify.com/api/v1/sites/${process.env.NETLIFY_SITE_ID}`, {
            headers: {
                authorization: `Bearer ${process.env.NETLIFY_TOKEN}`
            }
        })
        console.log(`Netlify WA_BOT_URL var updated: ${WA_BOT_URL === url}`)
        await axios.post(`https://api.netlify.com/api/v1/sites/${process.env.NETLIFY_SITE_ID}/builds`, {}, {
            headers: {
                authorization: `Bearer ${process.env.NETLIFY_TOKEN}`
            }  
        })

        wa.initialize()

        await sleep(1000 * 30)
        
        const state = await wa.getState() 

        await client.query(
            q.Update(
                q.Ref(q.Collection('status'), '332036570083229762'),
                { data: { state }},
            )
        )
    } catch (error) {
        console.log(error)
    }
}).catch(error => {
    console.log(error)
})

process.on("SIGINT", async () => {
    console.log("(SIGINT) Shutting down...")
    await wa.destroy()
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

