import express from "express"
import { signup } from "../controllers/authControllers";
import { signin } from "../controllers/authControllers";
import { googleSignin } from "../controllers/authControllers";
const router = express.Router();


router.post("/signup", signup)
router.post("/signin", signin)
router.post("/googleSignin", googleSignin)
export default router;