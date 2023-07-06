const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
const User = require('./models/User');

//encrypts user login credentials
var salt = bcrypt.genSaltSync(10);

app.use(cors());
app.use(express.json());

//connects to mongo db
mongoose.connect('mongodb+srv://blog:StvdR1AGVtN0kCPD@blog.v6adnmd.mongodb.net/?retryWrites=true&w=majority');

//hashes user login credentials
app.post('/register', async (req, res) => {
    const {username, password} = req.body;
    const userDoc = await User.create({
        username, 
        password: bcrypt.hashSync(password, salt),
    })
    res.json(userDoc)
})

//compares user credentials to hashed password
app.post('/login', async (req, res) => {
    const {username, password} = req.body;
    const userDoc = await User.findOne({username: username})
    const passOk = bcrypt.compareSync(password, userDoc.password)
    res.json(passOk)
})

console.log('test')
app.listen(3000);
