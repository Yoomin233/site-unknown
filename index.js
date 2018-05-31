const express = require('express')
const app = express()

app.get('/loveactionmovies', (req, res) => res.send('welcome to basic!'))

app.listen(80, () => console.log('server running at port 80'))