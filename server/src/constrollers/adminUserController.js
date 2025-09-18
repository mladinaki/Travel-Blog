const { User } = require("../models");
const generateToken = require("../Utils/utils");

const adminLogin = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Email and Password are required!' });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Access denied' });
    }

    if (user.password !== password) {
        return res.status(401).json({ success: false, message: 'Invalid password' });
    }

    const token = generateToken(user);
    return res.status(200).json({ success: true, token, user });
}

module.exports = { adminLogin };
