const axios = require('axios').default
const dotenv = require('dotenv')
dotenv.config()

const baseUrl = 'https://api.vercel.com'

const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${process.env.VERCEL_TOKEN}`
}

const vercelDeploy = async () => {

  const { data: { bootedAt }} = await axios.post(`${baseUrl}/v13/deployments`, {
    name: process.env.VERCEL_PROJECT_NAME,
    gitSource: {
      type: "github",
      org: "giovannilaperna",
      repo: process.env.GITHUB_REPO_NAME,
      ref: "main",
    },
    target: "production"
  }, {
    params: {
      teamId: process.env.VERCEL_TEAM_ID,
      forceNew: 1,
      skipAutoDetectionConfirmation: 1,
      withCache: 1
    },
    headers
  })

  if (bootedAt) console.log('Vercel deploying: true')
}

const vercelUpdateEnv = async(ngrokUrl) => {

  const { data : { key }} = await axios.patch(`${baseUrl}/v7/projects/${process.env.VERCEL_PROJECT_NAME}/env/${process.env.VERCEL_ENV_ID}`,{
    key: "WA_BOT_URL",
    value: ngrokUrl,
    target:[
      "production",
      "preview",
      "development"
    ],
    type: "encrypted",
    gitBranch: null
  }, {
    params: {
      teamId: process.env.VERCEL_TEAM_ID
    },
    headers
  })

  if (key === 'WA_BOT_URL') console.log('Vercel WA_BOT_URL ENV updated: true')
}

module.exports.vercelDeploy = vercelDeploy
module.exports.vercelUpdateEnv = vercelUpdateEnv

