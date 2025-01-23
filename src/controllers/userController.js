const User = require('../models/userModel')

const getAllUsers = async (req, res) =>{
    const users = await User.find({}, "_id username role")
    res.json({users})
}

const getUser = async (req, res) =>{
    const user = await User.findOne({_id:req.params.userId}, "_id username role")
    res.json({user})
}

const deleteUser = async (req, res) => {
    try{
        const user = await User.findById(req.params.userId)
        if(!user){
            return res.status(404).json({success: false, message: 'User not found'})
        }
        if(req.user.id === req.params.userId){
            return res.status(403).json({success: false, message: 'Cannot delete your own admin account'})
        }
        await User.findByIdAndDelete(req.params.userId)
        res.status(200).json({success: true, message: 'User successfully deleted'})
    }catch(error){
        console.error(error.message)
        res.status(500).json({success: false, message: 'Server error'})
    }
}

const updateUser = async (req, res) => {
    const {username, email} = req.body
    const user = await User.findById(req.params.userId)
    if(!user){
        res.status(404).send('User not found')
    }
    try{
        if(username){
            user.username = username
        }
        if(email){
            user.email = email
        }
        res.status(200).json({success: true, message: 'User successfully updated'})
    }catch(error){
        res.status(500).send('Server Error')
    }
}

module.exports = {getAllUsers, getUser, deleteUser, updateUser}