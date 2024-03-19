import express from "express";
import { logoutFunc, userLogin, userRegister } from "../controllers/userController.js";
const router = express.Router();

router.post('/register', userRegister)
router.post('/login', userLogin);
router.get('/logout', logoutFunc)

export default router;

