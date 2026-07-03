import { Router } from "express";
import { getProfile } from "../controllers/gym/gymController";
import { verifyToken } from "../utils/jwt";


const router=Router()


router.get("/profile",verifyToken, getProfile);


export default router;