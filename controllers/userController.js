const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

const User = require("../models/User");

const SALT_ROUNDS = 10;
const SECRET_KEY = process.env.SECRET_KEY;

exports.signup = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "User already exist" });
        }
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
        const newUser = new User({ username, email, password: hashedPassword });

        await newUser.save();
        res.status(201).json({ message: "User successfully created, please login!" });
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: "Internal Server Error" });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        console.log("Here");

        if (!user) {
            return res.status(404).json({ message: "User not found, sign in" });
        }
        const isCorrectPassword = await bcrypt.compare(password, user.password);
        if (isCorrectPassword) {
            const token = jwt.sign({ userId: user._id, username: user.username, email: user.email }, SECRET_KEY, { expiresIn: '1h' });
            res.cookie('authToken', token, {
                httpOnly: true,
                maxAge: 24 * 60 * 60 * 1000
            });
            return res.status(200).json({ message: "Success, re-directing you to your dashboard" });
        } else {
            res.status(401).json({ message: "Wrong credentials, please re-enter" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

exports.verifyAuth = async (req, res) => {
    try {
        res.status(404).json({ message: "User not logged in" });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
}
