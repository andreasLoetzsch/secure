const mongoose = require('mongoose')

const userModel = new mongoose.Schema({
        username: {type: String, required: true},
        password: {type: String, require: true},
        role: {type: String},
        accessToken: {type: String}
    })
    
module.exports = mongoose.model('user', userModel)