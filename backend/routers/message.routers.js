import express from "express";
import { protect } from "../middlewares/auth.middlewares.js"
import { sendMessage, allMessages } from "../controllers/message.controllers.js"

const router = express.Router();
router.route('/').post(protect, sendMessage)
router.route('/:chatId').get(protect, allMessages)

export default router