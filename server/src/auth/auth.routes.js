import express from "express";
import { googleAuth, signup, login} from "./auth.controller.js";

const router = express.Router();

router.post("/google", googleAuth);
router.post("/signup", signup);
router.post("/login", login);
export default router;