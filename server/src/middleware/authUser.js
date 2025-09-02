const jwt = require('jsonwebtoken');
require('dotenv').config();

const authUser = (req, res, next) => {
    const { token } = req.headers

    if (!token) {
         return res.status(401).json({ success: false, message: "Не сте логнат. Моля, влезте в системата." });
    }
    try {
        const token_decode = jwt.verify(token, process.env.JWT_SECRET)
        req.user = {
            id:token_decode.id,
            email:token_decode.email,
            username:token_decode.username,
        };
        next()
        
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ success: false, message: "Session expired. Please log in again." });
        }
        return res.status(400).json({ success: false, message: "Invalid token." });
    }
};

module.exports = { authUser };