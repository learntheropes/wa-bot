const dotenv = require('dotenv')
dotenv.config()

const auth = (req, res, next) => {
    const authHeader = req.headers['authorization']
    console.log(req.headers)
    if (!authHeader) return res.sendStatus(401)
    
    const token = authHeader.split(' ')[1]

    if (!token) return res.sendStatus(401)
    if (token !== process.env.CRON) return res.sendStatus(403)

    next()
}

module.exports = auth