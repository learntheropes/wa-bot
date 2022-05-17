const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config()

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (!token) return res.sendStatus(401)

    jwt.verify(token, process.env.CUSTOM_TOKEN_SECRET, { subject: 'urn:Auth0', audience: 'urn:wabot' }, (err, user) => {

        if (err) {
            console.log(err)
            return res.sendStatus(403)
        }

        next()
    })
}

module.exports = authenticateToken