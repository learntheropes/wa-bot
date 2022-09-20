const axios = require('axios').default
const dotenv = require('dotenv')
dotenv.config()

const baseUrl = 'https://api.digitalocean.com'

const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${process.env.DIGITALOCEAN_API_KEY}`
}

const digitalOceanGetApp = async () => {
  const { status, data: { app: { active_deployment: { spec }}}} = await axios.get(`${baseUrl}/v2/apps/${process.env.DIGITALOCEAN_APP_ID}`, {
    headers
  })
  return spec
}

const digitalOceanUpdateApp = async (ngrokUrl) => {
  const spec = await digitalOceanGetApp()
  spec.services[0].envs[0].value = ngrokUrl
  console.log(JSON.stringify(spec, null, 2))
  const { data } = await axios.put(`${baseUrl}/v2/apps/${process.env.DIGITALOCEAN_APP_ID}`, {
    spec
  }, {
    headers
  })
  return data
}

module.exports.digitalOceanUpdateApp = digitalOceanUpdateApp