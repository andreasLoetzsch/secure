const express = require('express')
const app = express()
const authRouter = require('./routes/auth')
const userRouter = require('./routes/user')

app.use(express.json())

app.use('/user', userRouter)
app.use('/auth', authRouter)

module.exports = app