import express from "express"
import { resumeUpload } from "../controllers/uploadControllers";
import { guestAnalysis } from "../controllers/analysisControllers"
import { analysis } from "../controllers/analysisControllers"

const router = express.Router();

router.post("/guest", guestAnalysis)
router.post("/", analysis)

export default router;