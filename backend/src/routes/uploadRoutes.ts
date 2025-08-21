import express from "express"
import { resumeUpload } from "../controllers/uploadControllers";
import { jdWithFileName } from "../controllers/uploadControllers"
import { jdWithFileNameGuest } from "../controllers/uploadControllers"
import { authMiddleware } from "../middlewares/auth";
const router = express.Router();

router.post("/resume", resumeUpload)
router.post("/jd-resume", authMiddleware, jdWithFileName)
router.post("/jd-resume/guest", jdWithFileNameGuest)


export default router;