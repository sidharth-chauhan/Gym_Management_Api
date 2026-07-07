import { Router } from "express";
import { addMember, addMembership, addTrainer, dashboard, getMemberById, getMembers, getMembershipById, getMemberships, getProfile, getTrainer, getTrainerById, removeMember, removeMembership, removeTrainer, updateGym, updateMember, updateMembership, updateTrainer } from "../controllers/gym/gymController";
import { verifyToken } from "../utils/jwt";
import { verify } from "node:crypto";


const router=Router()


//general
router.get("/profile",verifyToken, getProfile);
router.get("/dashboard",verifyToken,dashboard)
router.patch("/profile/gym",verifyToken,updateGym)


//membership
router.post("/memberships",verifyToken,addMembership)
router.get("/memberships",verifyToken,getMemberships)
router.get("/memberships/:id",verifyToken,getMembershipById)
router.patch("/memberships/:id",verifyToken,updateMembership)
router.delete("/memberships/:id",verifyToken,removeMembership)


//trainer
router.post("/trainers",verifyToken,addTrainer)
router.get("/trainers",verifyToken,getTrainer)
router.get("/trainers/:id",verifyToken,getTrainerById)
router.patch("/trainers/:id",verifyToken,updateTrainer)
router.delete("/trainers/:id",verifyToken,removeTrainer)


//member
router.post("/members",verifyToken,addMember)
router.get("/members",verifyToken,getMembers)
router.get("/members/:id",verifyToken,getMemberById)
router.patch("/members/:id",verifyToken,updateMember)
router.delete("/members/:id",verifyToken,removeMember)


export default router;