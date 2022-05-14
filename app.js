const express = require('express')
const bodyParser = require('body-parser')
const client = require('./whatsapp')
// const rmfr = require('rmfr');

// rmfr('.wwebjs_auth').then(() => {

//     client.initialize().then(async () => {
//         const version = await client.getWWebVersion()
//         console.log(`WHATSAPP WEB version: v${version}`)
//     })
//     .catch((err) => {
//         console.error(err)   
//     })
// })

client.initialize()

process.on("SIGINT", async () => {
    console.log("(SIGINT) Shutting down...");
    await client.destroy();
    process.exit(0);
})

const app = express()
const port = 8000

app.use(express.static('.wwebjs_auth'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const login = require('./routes/login')

app.use(login)

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})
