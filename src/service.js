const app = require('./app')
const PORT = process.env.PORT || 3000
const connectDB = require('./config/db')


connectDB()

app.listen(PORT, (req, res)=>{
    console.log(`Listening on port: ${PORT}`)
})