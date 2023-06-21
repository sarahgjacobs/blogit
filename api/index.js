const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors());

app.post('/register', (req, res) => {
    res.json('it worked')
})

console.log('test')
app.listen(3000);