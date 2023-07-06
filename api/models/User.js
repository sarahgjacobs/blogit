const mongoose = require('mongoose');
const {Schema, model} = mongoose;

//creates requirements for new user model
const UserSchema = new Schema({
    username: {
        type: String, 
        required: true,
        min: 4, 
        unique: true},
    password: {
        type: String, 
        required: true}
});

const UserModel = model('User', UserSchema);

module.exports = UserModel;