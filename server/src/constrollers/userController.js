const bcrypt = require("bcrypt");
const User = require("../models/User");
const generateToken = require("../Utils/utils");
require("dotenv").config();

const userRegister = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).send('Please provide a name, email, and password');
        }

        const existingUser = await User.findOne({ where: { email } });

        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const salt = 10;
        const hashPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            username,
            email,
            password: hashPassword
        });

        const token = generateToken(user);
        return res.status(201).json({
            token,
            user: {
                username: user.username
            }
        });

    } catch (error) {
        console.error('Error during registration:', error);
        return res.status(500).json({ message: 'Server error creating user' });
    }
};

const userLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email or password is required' });
        }
        const user = await User.findOne({ where: { email: email } });

        if (!user) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({ error: 'Invalid email or password' })
        }

        const token = generateToken(user);
        return res.json({ token, user: { id: user.id, username: user.username, email: user.email } });


    } catch (error) {
        console.error('Error during password comparison or token generation:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

const adminLogin = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Email and Password are required!' });
    }

    try {
        const user = await User.findOne({ where: { email } })

        if (!user) {
            return res.status(404).json({ error: 'User not found' })
        }

        if(user.role )

        if (email === process.env.EMAIL_ADMIN && password === process.env.PASS_ADMIN) {
            const token = generateToken(user)
            res.status(200).json({ success: true, token });
        }

        else {
            res.json({ success: false, message: 'Invalid Credentials' });
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error getting user', error: error });
    }
}

const logout = async (req, res) => {
    res.clearCookie('token')
    res.status(200).json({ message: 'Logged out successfully' })
}

module.exports = { userRegister, userLogin, logout, adminLogin };
