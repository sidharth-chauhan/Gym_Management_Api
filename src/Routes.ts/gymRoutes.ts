import { Router } from "express";
import { addMembership, dashboard, getMembershipById, getMemberships, getProfile, removeMembership, updateMembership } from "../controllers/gym/gymController";
import { verifyToken } from "../utils/jwt";


const router=Router()


router.get("/profile",verifyToken, getProfile);
router.get("/dashboard",verifyToken,dashboard)
router.post("/memberships",verifyToken,addMembership)
router.get("/memberships",verifyToken,getMemberships)
router.get("/memberships/:id",verifyToken,getMembershipById)
router.patch("/memberships/:id",verifyToken,updateMembership)
router.delete("/memberships/:id",verifyToken,removeMembership)

export default router;