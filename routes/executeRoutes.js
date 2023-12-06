const express = require('express');
const router = express.Router();

const executeController = require('../controllers/executeController');

router.post('/', executeController.executeCode);
router.post('/basic', executeController.basicPlanExecute);

module.exports = router;