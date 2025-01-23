const {getAllUsers, getUser, deleteUser} = require('../controllers/userController')
const {isAdmin, isLoggedIn} = require('../middleware/auth')
const express = require('express')
const router = express.Router()



router.get('/', isLoggedIn,getAllUsers)
router.get('/:userId', isLoggedIn, getUser)
router.delete('/:userId', isAdmin, deleteUser)

module.exports = router