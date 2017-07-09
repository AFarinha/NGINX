const express = require('express')
const app = express()

app.post('/writeFile', function (req, res) {
  console.log('olaaaa');
  res.send('Hello World!')
})

app.listen(8079, function () {
  console.log('Example app listening on port 3000!')
})
