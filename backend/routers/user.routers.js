import express from "express";
import { registerUser, loginUser, getAllUsers } from "../controllers/user.controllers.js";
import { protect } from "../middlewares/auth.middlewares.js";

const router = express.Router();
router.route('/').post(registerUser).get(protect, getAllUsers)
router.route('/login').post(loginUser)

export default router