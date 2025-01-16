import express from "express";
import { accessChat, createGroupChat, fetchChats, renameGroup, removeGroupMember, addGroupMember } from "../controllers/chat.controllers.js";
import { protect } from "../middlewares/auth.middlewares.js";

const router = express.Router();

router.route('/').post(protect, accessChat)
router.route('/').get(protect, fetchChats)
router.route('/group').post(protect, createGroupChat)
router.route('/rename').put(protect, renameGroup)
router.route('/groupremove').put(protect, removeGroupMember)
router.route('/groupadd').put(protect, addGroupMember)

export default router