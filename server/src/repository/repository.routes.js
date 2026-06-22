import express from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import {
  analyzeRepository,
  getRepositoryOverview,
  getArchitecture,
  getRepositoryTree,
  getRepositoryFiles,
  getUserRepositories,
  requireRepositoryAccess,
} from "./repository.controller.js";

const router = express.Router();

router.get("/mine", authenticate, getUserRepositories);
router.post("/analyze", authenticate, analyzeRepository);
router.get("/summary/:id", authenticate, requireRepositoryAccess, getRepositoryOverview);
router.get("/tree/:id", authenticate, requireRepositoryAccess, getRepositoryTree);
router.get("/files/:id", authenticate, requireRepositoryAccess, getRepositoryFiles);
router.get("/architecture/:id", authenticate, requireRepositoryAccess, getArchitecture);

export default router;
