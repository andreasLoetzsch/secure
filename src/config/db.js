const mongoose = require('mongoose')
require('dotenv').config()

const connectDB = async (req, res) =>{
    mongoose.connect(process.env.DB_CONNECTION_STRING)
    console.log('DB connected')
}

module.exports = connectDB