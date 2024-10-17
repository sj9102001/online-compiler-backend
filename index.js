const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const app = express();
require('dotenv').config();

const userRoutes = require('./routes/userRoutes');
const fileRoutes = require('./routes/fileRoutes');
const executeRoutes = require('./routes/executeRoutes');

const { verifyUser } = require('./middlewares/verifyUser');

const port = process.env.PORT | 8080;

mongoose.connect('mongodb://127.0.0.1/onlinecompiler', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');
    next();
});

app.use(cookieParser());
app.use(express.json());

app.use('/user', userRoutes);
app.use('/file', fileRoutes);
app.use('/execute', executeRoutes);
app.get('/test', verifyUser, (req, res) => {
    res.json({ message: req.cookies["authToken"], user: req.user });
});


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
