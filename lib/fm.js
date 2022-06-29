var forever = require('forever-monitor')

const fm = new(forever.Monitor)('app.js', {
    max: 1,
    silent: false,
    sourceDir: (!process.env.DESKTOP_SESSION) ? '/var/www/html/wa-bot/' : null
})

module.exports = fm