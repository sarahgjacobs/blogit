const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
const User = require('./models/User');
const Post = require('./models/Post');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const uploadMiddleware = multer({ dest: 'uploads/'});
const fs = require('fs');

//encrypts user login credentials
var salt = bcrypt.genSaltSync(10);
//secret web token
var secret = 'secretkey';

app.use(cors({credentials: true,origin: 'http://localhost:3001'}));
app.use(express.json());
app.use(cookieParser());

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
    if (passOk) {
        //logged in
        jwt.sign({username, id: userDoc.id}, secret, {}, (err, token) => {
        if (err) throw err;
        res.cookie("token", token).json({
            id:userDoc._id,
            username
        })
    });
    } else {
        res.status(400).json('Wrong credentials')
    }
})

app.post('/logout', (req, res) => {
    res.cookie("token", "").json('ok')
})

app.post('/post', uploadMiddleware.single('file'), async (req, res) => {
    const {originalname,path} = req.file;
    const parts = originalname.split('.');
    const ext = parts[parts.length - 1];
    const newPath = path+'.'+ext;
    fs.renameSync(path, newPath);

    const {token} = req.cookies;
    jwt.verify(token, secret, {}, async (err, info) => {
        if (err) throw err;
        const {title, summary, content} = req.body;
    const postDoc = await Post.create({
        title,
        summary,
        content,
        cover: newPath,
        author:info.id,
   })
        res.json(info)
    })
})    


app.get('/profile', (req, res) => {
    const {token} = req.cookies;
    jwt.verify(token, secret, {}, (err, info) => {
        if (err) throw err;
        res.json(info)
    })
    res.json(req.cookies);
})

app.get('/post', async (req, res) => {
    const posts = await Post.find();
    res.json(posts)
})


console.log('test')
app.listen(3000);
