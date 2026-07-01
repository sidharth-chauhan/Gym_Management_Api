import express, { Router } from "express";
import { loginUser, registerGym } from "../controllers/auth/authcontroller";

const router = Router();

router.post("/register/gym", registerGym);
router.post("/login",loginUser);


export default router;
