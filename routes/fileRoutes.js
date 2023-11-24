const express = require('express');
const router = express.Router();

const fileController = require('../controllers/fileController');

router.post('/', fileController.newFile);

router.get('/', fileController.getFiles);

module.exports = router;