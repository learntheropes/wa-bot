const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config()

const auth = (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (!token) return res.sendStatus(401)

    jwt.verify(token, process.env.AUTH0_CUSTOM_TOKEN_SECRET, { subject: 'urn:Auth0', audience: 'urn:wabot' }, (err, user) => {

        if (err) {
            console.log(err)
            return res.sendStatus(403)
        }

        next()
    })
}

module.exports = auth
