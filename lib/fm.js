var forever = require('forever-monitor')

const fm = new(forever.Monitor)('app.js', {
    max: 1,
    silent: false,
})

module.exports = fm