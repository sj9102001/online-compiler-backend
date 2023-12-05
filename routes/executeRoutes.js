const express = require('express');
const router = express.Router();

const executeController = require('../controllers/executeController');

router.post('/', executeController.executeCode);

module.exports = router;