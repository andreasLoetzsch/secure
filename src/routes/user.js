const {getAllUsers, getUser} = require('../controllers/userController')
const express = require('express')
const router = express.Router()

router.get('/', getAllUsers)
router.get('/:userId', getUser)

module.exports = router