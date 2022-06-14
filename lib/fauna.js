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
const updateFaunaStatus = async (state) => {
    await client.query(
        q.Update(
            q.Ref(q.Collection('status'), '332036570083229762'),
            { data: { state }},
        )
    )
}

module.exports.q = q
module.exports.client = client
module.exports.updateFaunaStatus = updateFaunaStatus