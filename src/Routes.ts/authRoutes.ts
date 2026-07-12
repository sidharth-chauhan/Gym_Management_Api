import express, { Router } from "express";
import { loginUser, registerGym, test } from "../controllers/auth/authcontroller";

const router = Router();


router.post("/login",loginUser);
router.post("/register/gym", registerGym);

router.get("/test", test);



export default router;
