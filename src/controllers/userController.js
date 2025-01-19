const User = require('../models/userModel')

const getAllUsers = async (req, res) =>{
    const users = await User.find({}, "_id username role")
    res.json({users})
}

const getUser = async (req, res) =>{
    const user = await User.findOne({_id:req.params.userId}, "_id username role")
    res.json({user})
}

module.exports = {getAllUsers, getUser}