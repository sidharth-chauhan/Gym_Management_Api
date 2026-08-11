import { Router } from "express";
import { addMember, addMembership, addTrainer, dashboard, getAllGym, getMemberById, getMembers, getMembershipById, getMemberships, getProfile, getTrainer, getTrainerById, removeMember, removeMembership, removeTrainer, searchMembers, searchTrainers, updateGym, updateMember, updateMembership, updateOwnMemberProfile, updateOwnTrainerProfile, updateTrainer } from "../controllers/gym/gymController";
import { verifyToken } from "../utils/jwt";
import { verify } from "node:crypto";


const router=Router()


//general
router.get("/profile",verifyToken, getProfile);
router.get("/dashboard",verifyToken,dashboard)

router.patch("/profile/gym",verifyToken,updateGym)
router.get("/fullgym",getAllGym)


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

router.patch("/trainer/profile",verifyToken,updateOwnTrainerProfile)


//member
router.post("/members",verifyToken,addMember)
router.get("/members",verifyToken,getMembers)
router.get("/members/:id",verifyToken,getMemberById)
router.patch("/members/:id",verifyToken,updateMember)
router.delete("/members/:id",verifyToken,removeMember)

router.patch("/member/profile",verifyToken,updateOwnMemberProfile)

// search 
router.get("/search/members/:query",verifyToken,searchMembers)
router.get("/searcah/trainers/:query",verifyToken,searchTrainers)


export default router;