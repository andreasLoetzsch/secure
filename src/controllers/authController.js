const User = require('../models/userModel')
const bcrypt = require('bcryptjs')
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const createUser = async (req, res) => {
    const {username, password} = req.body
    if(!username || !password){
        res.status(401).send('Username and password required!')
    }
    try{
        const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt)
    const newUser = await new User({username, password: hashedPassword})
    const user = await newUser.save()
    res.status(201).send('User created')
    }
    catch(error){
        res.status(500).send('Server error')
    }
}

const loginUser = async (req, res) =>{
    const {username, password} = req.body
    if(!username || !password){
        return res.status(201).send('Username and password required')
    }
    try{
        const user = await User.findOne({username})
    if(!user){
        return res.status(404).send('User not found')
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if(!isMatch){
       return res.status(401).send('Invalid credentials')
    }
    const accessToken = jwt.sign(
        {id: user._id, role: user.role, username: user.username},
        process.env.ACCESS_TOKEN_SECRET_KEY,
        {expiresIn: '15m'}
    )
    const refreshToken = jwt.sign(
        {id: user._id, role: user.role, username: user.username},
        process.env.REFRESH_TOKEN_SECRET_KEY,
        {expiresIn: '7d'}
    )
    const hashedRefreshToken = bcrypt.hash(refreshToken, 10)
    user.refreshToken = hashedRefreshToken
    await user.save()
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000
    })

     return res.status(200).json({message: 'LOGGED_IN', accessToken})
    }
    catch(error){
        return res.json({succes: false, message: 'ERROR_VERIFYING'})
    }
    
}


const refreshToken = async (req, res) =>{
    const {refreshToken} = req.cookies
    const  authHeader = req.headers.authorization
    const accesToken = authHeader && authHeader.split(" ")[1]
    if(!refreshToken){
        return res.status(403).send('Token missing')
    }
    try{
        if(accesToken){
            try{
                jwt.verify(accesToken, process.env.ACCES_TOKEN_SECRET_KEY)
                return res.status(200).json({accesToken, message: 'Token not expired'})
            }catch(error){
                if(error.name !== "TokenExpiredError"){
                    return res.status(403).send('Invalid token')
                }
            }
        }
        const decoded = await jwt.decode(refreshToken)
        const user = await User.findOne({_id: decoded.id}, "_id username refreshToken")
        if(!user){
            res.status(403).send('User missing')
        }
        const isValid = await bcrypt.compare(refreshToken, user.refreshToken)
        if(!isValid){
            return res.status(403).send('Invalid token')
        }
        const newAccesToken = jwt.sign(
            {id: user._id, role: user.role, username: user.username},
            process.env.ACCES_TOKEN_SECRET_KEY,
            {expiresIn: '15m'}
        )
        const newRefreshToken = jwt.sign(
            {id: user._id, role: user.role, username: user.username},
            process.env.REFRESH_TOKEN_SECRET_KEY,
            {expiresIn: '7d'}
        )
        const hashedRefreshToken = await bcrypt.hash(newRefreshToken, 10)
        user.refreshToken = hashedRefreshToken
        await user.save()
        res.cookie("refreshToken", newRefreshToken, {
            httpOnly: true, 
            secure: true,
            sameSite: "strict", 
            maxAge: 7 * 24 * 60 * 60 * 1000
        })
        res.status(200).json({accesToken: newAccesToken})
    }
    catch(error){
        res.status(500).send('Server error')
    }
}
module.exports = {createUser, loginUser, refreshToken}