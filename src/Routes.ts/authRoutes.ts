import express, { Router } from "express";
import { changePassword, forgotPassword, generateOtp, loginUser, registerGym,  test } from "../controllers/auth/authController";

const router = Router();


router.post("/login",loginUser);
router.post("/register/gym", registerGym);

router.post("/changePassword",changePassword)
router.get("/test", test);


//forget password
router.post("/generateOTP", generateOtp);
router.post("/forgetPassword", forgotPassword);



export default router;
