const jwt = require("jsonwebtoken")

const generateToken = (user) => {
    const payload = {
        id: user.id,
        // userId: user.id,
        email: user.email,
        username: user.username,
        role: user.role

    }
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" })
}

module.exports = generateToken