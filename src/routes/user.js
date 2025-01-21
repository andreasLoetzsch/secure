const {getAllUsers, getUser, deleteUser} = require('../controllers/userController')
const {isAdmin} = require('../middleware/auth')
const express = require('express')
const router = express.Router()



router.get('/', getAllUsers)
router.get('/:userId', getUser)
router.delete('/:userId', isAdmin, deleteUser)

module.exports = router