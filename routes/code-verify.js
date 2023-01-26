const { Router } = require('express')
const router = Router()
const asyncHandler = require('express-async-handler')
const { q, client } = require('../lib/fauna')
const auth = require('../middlewares/authentication')

router.post('/code-verify', auth, asyncHandler(async (req,res) => {

    const { recipient, code } = req.body

    const exists = await client.query(
        q.Exists(
            q.Match(q.Index('verifications_by_recipient_and_code'), recipient, parseInt(code))
        )
    )

    if (exists) {

        await cleanDatabase(recipient)

        res.status(200).json({
            status:'success',
            message:`Valid code`
        })
    } else {

        res.status(500).json({
            status:'error',
            message:`invalidWhatsappCode`
        })      
    }
}))

const cleanDatabase = async (recipient) => {

    const { data } = await client.query(
        q.Paginate(
            q.Match(q.Index("verifications_by_recipient"), recipient),
            { size: 100000 }
        )
    )

    for (var index in data) {
        const { value: { id }} = data[index]
        await client.query(
            q.Delete(q.Ref(q.Collection('verifications'), id))
        )
    }
}

module.exports = router