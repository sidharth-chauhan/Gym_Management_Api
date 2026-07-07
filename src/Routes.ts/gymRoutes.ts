import { Router } from "express";
import { addMembership, addTrainer, dashboard, getMembershipById, getMemberships, getProfile, getTrainer, getTrainerById, removeMembership, removeTrainer, updateMembership, updateTrainer } from "../controllers/gym/gymController";
import { verifyToken } from "../utils/jwt";


const router=Router()


router.get("/profile",verifyToken, getProfile);
router.get("/dashboard",verifyToken,dashboard)
router.post("/memberships",verifyToken,addMembership)
router.get("/memberships",verifyToken,getMemberships)
router.get("/memberships/:id",verifyToken,getMembershipById)
router.patch("/memberships/:id",verifyToken,updateMembership)
router.delete("/memberships/:id",verifyToken,removeMembership)


router.post("/trainers",verifyToken,addTrainer)
router.get("/trainers",verifyToken,getTrainer)
router.get("/trainers/:id",verifyToken,getTrainerById)
router.patch("/trainers/:id",verifyToken,updateTrainer)
router.delete("/trainers/:id",verifyToken,removeTrainer)

export default router;