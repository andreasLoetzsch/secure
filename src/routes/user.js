const {getAllUsers, getUser, deleteUser, updateUser} = require('../controllers/userController')
const {isAdmin, isLoggedIn} = require('../middleware/auth')
const express = require('express')
const router = express.Router()



router.get('/', isLoggedIn,getAllUsers)
router.get('/:userId', isLoggedIn, getUser)
router.delete('/:userId', isAdmin, deleteUser)
router.put('/edit:userId', isLoggedIn, updateUser)

module.exports = router