const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');

// POST /webhook/message
router.post('/message', messageController.handleIncomingMessage);

module.exports = router;
