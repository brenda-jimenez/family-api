const express = require('express')
const app = express()
const port = process.env.PORT
const host= process.env.HOST

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, host, () => {
  console.log(`Example app listening at http://${host}:${port}`)
})