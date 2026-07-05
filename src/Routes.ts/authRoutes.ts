import express, { Router } from "express";
import { loginUser, registerGym } from "../controllers/auth/authcontroller";

const router = Router();


router.post("/login",loginUser);
router.post("/register/gym", registerGym);



export default router;
