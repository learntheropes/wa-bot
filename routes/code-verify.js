const { Router } = require('express')
const router = Router()
const asyncHandler = require('express-async-handler')
const { q, client } = require('../lib/fauna')

router.post('/code-verify', asyncHandler(async (req,res) => {

    const { recipient, code, name, comment, model } = req.body

    const exists = await client.query(
        q.Exists(
            q.Match(q.Index('verifications_by_recipient_and_code'), recipient, parseInt(code))
        )
    )

    if (exists) {

        const { ref: { value: { id }}} = await client.query(
            q.Get(
                q.Match(q.Index('verifications_by_recipient_and_code'), recipient, parseInt(code))
            )
        )

        await client.query(
            q.Delete(q.Ref(q.Collection('verifications'), id))
        )

        await client.query(
            q.Create(
                q.Collection('comments'),
                { data: { name, comment, model }},
            )
        )      

        res.status(200).json({
            status:'success',
            message:`Comment added`
        })
    } else {

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

        res.status(500).json({
            status:'error',
            message:`Invalid code`
        })      
    }
}))

module.exports = router