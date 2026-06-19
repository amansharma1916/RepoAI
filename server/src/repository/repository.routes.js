import express from "express";
import { analyzeRepository , getRepositoryOverview , getRepositoryTree, getRepositoryFiles} from "./repository.controller.js";

const router = express.Router();

router.post("/analyze", analyzeRepository);
router.get("/summary/:id", getRepositoryOverview);
router.get("/tree/:id", getRepositoryTree);
router.get("/files/:id", getRepositoryFiles);

export default router;