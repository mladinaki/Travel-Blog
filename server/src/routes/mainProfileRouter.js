const express = require('express');
const { mainProfile, mainProfileOnline, mainProfileUpdate } = require('../constrollers/mainProfileController');
const { authUser, authAdmin } = require('../middleware/authUser');

const router = express.Router();

router.get("/mainProfile", authUser, authAdmin, mainProfile);
router.put("/mainProfile-online", authUser, authAdmin, mainProfileOnline);
router.put("/mainProfile-update", authUser, authAdmin, mainProfileUpdate);

module.exports = router;