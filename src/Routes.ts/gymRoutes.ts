import { Router } from "express";
import { dashboard, getProfile } from "../controllers/gym/gymController";
import { verifyToken } from "../utils/jwt";


const router=Router()


router.get("/profile",verifyToken, getProfile);
router.get("/dashboard",verifyToken,dashboard)


export default router;