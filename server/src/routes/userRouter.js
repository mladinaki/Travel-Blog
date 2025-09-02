const express = require('express');
const { userRegister, userLogin, adminLogin } = require('../constrollers/userController');

const router = express.Router();

router.post('/register', userRegister)
router.post('/login', userLogin)
router.post('/admin', adminLogin)

module.exports = router