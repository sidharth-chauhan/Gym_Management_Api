import { Router } from "express";
import { addMembership, dashboard, getMembershipById, getMemberships, getProfile, updateMembership } from "../controllers/gym/gymController";
import { verifyToken } from "../utils/jwt";


const router=Router()


router.get("/profile",verifyToken, getProfile);
router.get("/dashboard",verifyToken,dashboard)
router.post("/membership",verifyToken,addMembership)
router.get("/memberships",verifyToken,getMemberships)
router.get("/membership/:id",verifyToken,getMembershipById)
router.patch("/membership/:id",verifyToken,updateMembership)

export default router;