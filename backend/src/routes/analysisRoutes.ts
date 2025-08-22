import express from "express"
import { guestAnalysis } from "../controllers/analysisControllers"
import { analysis } from "../controllers/analysisControllers"
import { authMiddleware } from "../middlewares/auth";

const router = express.Router();

router.post("/guest", guestAnalysis)
router.post("/", authMiddleware, analysis)

export default router;