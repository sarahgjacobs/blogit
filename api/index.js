const express = require('express');
const app = express();

app.get('/test', (req, res) => {
    res.json('it worked')
})

console.log('test')
app.listen(4000);