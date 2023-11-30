const express = require('express');
const router = express.Router();

const fileController = require('../controllers/fileController');
const { verifyUser } = require('../middlewares/verifyUser');

router.post('/', fileController.newFile);

router.get('/', verifyUser, fileController.getFiles);

router.get('/code/:codeId', fileController.getCode);

router.put('/code/:codeId', fileController.saveCode);

router.delete('/code/:codeId', fileController.deleteFile);

module.exports = router;