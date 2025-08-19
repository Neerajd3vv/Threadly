import express from "express"
import { jdWithFileName } from "../controllers/jdController"
import { authMiddleware } from "../middlewares/auth";

const router = express.Router();

router.post("/jd", authMiddleware, jdWithFileName)

export default router;