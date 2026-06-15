import express from "express";
import { analyzeRepository , getRepositoryOverview , getRepositoryTree} from "./repository.controller.js";

const router = express.Router();

router.post("/analyze", analyzeRepository);
router.get("/overview/:id", getRepositoryOverview);
router.get("/tree/:id", getRepositoryTree);

export default router;