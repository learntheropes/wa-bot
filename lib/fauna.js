const faunadb = require('faunadb')
const dotenv = require('dotenv')
dotenv.config()

const secret = process.env.FAUNADB_KEY
const q = faunadb.query
const client = new faunadb.Client({
    secret,
    scheme: 'https',
    domain: 'db.us.fauna.com'
})

module.exports.q = q
module.exports.client = client