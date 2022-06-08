const axios = require('axios').default
const dotenv = require('dotenv')
dotenv.config()

const auth0GetToken = async () => {
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
  return access_token
}

const auth0UpdateGateway = async (ngrokUrl, access_token) => {
  const { data: { options : { gateway_url }}} = await axios.patch(`https://${process.env.AUTH0_URL}/api/v2/connections/${process.env.AUTH0_GATEWAY_ID}`, {
    "options":{
        "provider": "sms_gateway",
        "gateway_url": `${ngrokUrl}/login`,
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
            "secret": process.env.AUTH0_CUSTOM_TOKEN_SECRET,
            "secret_base64_encoded": false
        }
    },
    "is_domain_connection":false,
    "enabled_clients":[
        process.env.AUTH0_ENABLED_CLIENT
    ]        
},{
    headers: {
        'Content-Type': 'application/json',
        'authorization': `Bearer ${access_token}`
    }
})
console.log(`Auth0 URL ${ngrokUrl} updated: ${ngrokUrl + '/login' === gateway_url}`)
}


module.exports.auth0GetToken = auth0GetToken
module.exports.auth0UpdateGateway = auth0UpdateGateway