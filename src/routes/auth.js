const express = require('express')
const router = express.Router();
const {createUser, loginUser, refreshToken} = require('../controllers/authController')

router.post('/refresh-token', refreshToken)
router.post('/register', createUser)
router.post('/login', loginUser)

module.exports = router