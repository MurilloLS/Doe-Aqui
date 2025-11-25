const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const authMiddleware = require('../middlewares/auth.middleware');

router.get("/chats", authMiddleware, messageController.getChatPartners);
router.get("/:id",authMiddleware, messageController.getMessagesByUserId);
router.post("/send/:id",authMiddleware, messageController.sendMessage);

module.exports = router;