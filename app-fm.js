const fm = require('./lib/fm')
const del = require('del')
const { q, client, updateFaunaStatus } = require('./lib/fauna')

const sleep = ms => new Promise(r => setTimeout(r, ms))

fm.start()

sleep(1000 * 40).then(async () => {

  const { data: { state }} = await client.query(
    q.Get(q.Ref(q.Collection('status'), '332036570083229762'))
  )

  if (!state) {
    await del(['temp'])
    console.log('DISCONNECTED: ')
    await updateFaunaStatus('DISCONNECTED')
    fm.restart()
  }
})