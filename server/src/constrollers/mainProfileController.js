// profileController.js
const { User } = require('../models');

const mainProfile = async (req, res) => {

    try {
        const userProfil = await User.findByPk(req.user.id, {
            attributes: ['id', 'username', 'email', 'password', 'online', 'role']
        });

        if (!userProfil) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(userProfil.toJSON());
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error', error: err });
    }
};

const mainProfileOnline = async (req, res) => {
    const userId = req.user.id;
    const { online } = req.body;
    try {
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found." });
        }
        user.online = true

        await user.save();
        return res.json({ success: true, message: "Profile updated successfully.", user });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: "Server error." });
    }
}

const mainProfileUpdate = async (req, res) => {
    const userId = req.user.id;
    const { username, email, password } = req.body;

    try {
        const user = await User.findByPk(userId);   
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found." });
        }
        user.username = username || user.username;
        user.email = email || user.email;
        user.password = password || user.password;
        await user.save();
        return res.json({ success: true, message: "Profile updated successfully.", user });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: "Server error." });
    }

}

module.exports = { mainProfile, mainProfileOnline, mainProfileUpdate };
