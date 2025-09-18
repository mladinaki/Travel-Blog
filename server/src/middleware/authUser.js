const jwt = require('jsonwebtoken');
const { User } = require('../models');
require('dotenv').config();

const authUser = (req, res, next) => {
    const { token } = req.headers

    if (!token) {
        return res.status(401).json({ success: false, message: "Не сте логнат. Моля, влезте в системата." });
    }
    try {
        const token_decode = jwt.verify(token, process.env.JWT_SECRET)
        req.user = {
            id: token_decode.id,
            email: token_decode.email,
            username: token_decode.username,
            role: token_decode.role
        };

        next()

    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ success: false, message: "Session expired. Please log in again." });
        }
        return res.status(400).json({ success: false, message: "Invalid token." });
    }
};

const authAdmin = async (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ success: false, message: "Unauthorized access." });
    }
    if (req.user.id === 0) {
        return next();
    }

    const user = await User.findByPk(req.user.id);
    if (!user) {
        return res.status(404).json({ success: false, message: "User not found." });
    }

    if (user.role !== 'admin') {
        return res.status(403).json({ success: false, message: "Access denied. Admins only." });
    }
    next();
};
module.exports = { authUser, authAdmin };