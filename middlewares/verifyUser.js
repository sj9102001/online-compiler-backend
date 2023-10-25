const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY;

const verifyUser = async (req, res, next) => {
    const token = req.cookies.authToken; // Assuming the token is stored in a cookie named 'authToken'

    if (!token) {
        return res.status(401).json({ message: "Unauthorized access" });
    }
    try {
        const verify = jwt.verify(token, SECRET_KEY);
        res.user = {
            username: verify.username,
            email: verify.email,
            userId: verify.userId
        };
        next();
    } catch (error) {
        return res.status(401).json({ name: error.name, message: error.message });
    }
}

module.exports = {
    verifyUser
}