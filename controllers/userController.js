const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

const User = require("../models/User");

const SALT_ROUNDS = 10;
const SECRET_KEY = process.env.SECRET_KEY;

exports.signup = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const user = await User.findOne({ username });
        if (user) {
            return res.status(400).json({ message: "User already exist" });
        }
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
        const newUser = new User({ username, email, password: hashedPassword });

        await newUser.save();

        res.status(201).json({ message: "Success" });
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: "Failure" });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const isCorrectPassword = await bcrypt.compare(password, user.password);
        if (isCorrectPassword) {
            const token = jwt.sign({ userId: user._id, username: user.username, email: user.email }, SECRET_KEY, { expiresIn: '1h' });
            return res.status(200).json({ message: "Correct Password", token });
        } else {
            res.status(401).json({ message: "Wrong Password" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Failure" });
    }
};