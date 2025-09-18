const express = require('express');
const { adminLogin } = require('../constrollers/adminUserController');

const router = express.Router();

router.post('/login', adminLogin)

module.exports = router;