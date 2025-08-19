import express from "express"
import { resumeUpload } from "../controllers/uploadControllers";
import { authMiddleware } from "../middlewares/auth";

const router = express.Router();

router.post("/resume", authMiddleware, resumeUpload)

export default router;