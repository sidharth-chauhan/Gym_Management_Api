import bcrypt from "bcrypt";
import User from "../../models/User";
import Gym from "../../models/Gym";
import {Request,Response} from "express";
import dotenv from "dotenv";
import { generateToken } from "../../utils/jwt";
import { sendEmail } from "../../utils/sendMail";
import Otp from "../../models/Otp";
import { send } from "node:process";

export const registerGym= async(req:Request,res:Response)=>{
  try{
    const {name,email,password,phoneNumber,gymName,address,gymType}=req.body;

    if(!name || !email || !password || !phoneNumber || !gymName || !address || !gymType){
      return res.status(400).json({error:"All fields are required"});
    }
    const salt=Number(process.env.SALT);
    const hashpass=await bcrypt.hash(password,salt);

    const user=await User.find({email:email});
    if(user.length>0){
      return res.status(400).json({error:"User already exists"});
    }

    const newUser= await User.create({
      name,
      email,
      role:"OWNER",
      password: hashpass,
      phoneNumber
    })
    console.log(newUser);

    const newGym=await Gym.create({
      name: gymName,
      address,
      gymType,
      ownerId: newUser._id
    })
    console.log(newGym);

    res.status(201).json({message:"Gym registered successfully",gym:newGym,user:newUser});

  }catch(err){
    console.error(err);
    res.status(500).json({error:"Server error"});
  }
}



export const loginUser = async (req:Request,res:Response)=> {
  try{
    const {email,password}=req.body;

    if(!email || !password){
      return res.status(400).json({error:"All fields are required"});
    }

    const user=await User.findOne({email:email});

    if(!user){
      return res.status(400).json({error:"User not found"});
    }

    const isMatch=await bcrypt.compare(password,user.password);
    console.log(isMatch);
    if(!isMatch){
      return res.status(400).json({error:"Invalid credentials"});
    }
    const token= await generateToken(user._id.toString());
    console.log(token);
    res.status(200).json({message:"Login successful",token});

  }catch(err){
    console.error(err);
    res.status(500).json({error:"Server error"});
  }
}

export const changePassword=async(req:Request,res:Response)=>{
  try{
    const {email,oldPassword,newPassword}=req.body;
    if(!email || !oldPassword || !newPassword){
      return res.status(400).json({error:"All fields are required"});
    }
    console.log(email,oldPassword,newPassword);
    const user=await User.findOne({email:email});
    if(!user){
      return res.status(400).json({error:"User not found"});
    }
    const salt=Number(process.env.SALT);
    const hashPass=await bcrypt.hash(newPassword,salt);

    const comparePass=await bcrypt.compare(oldPassword,user.password);
    if(!comparePass){
      return res.status(400).json({error:"Old password is incorrect"});
    }
    const updatePass=await User.findOneAndUpdate(
      {email:email},
      {
      password:hashPass
    }
    )
    if(!(updatePass as any)){
      return res.status(400).json({error:"Password not updated"});
    }
    res.status(200).json({message:"Password updated successfully"});
  }catch(err){
    console.error(err);
    res.status(500).json({error:"Server error"});
  }

}



export const test= async(req:Request,res:Response)=>{
  try{
    res.status(200).json({message:"Test successful"});

  }catch(err){
    console.error(err);
    res.status(500).json({error:"Server error"});
  }
}



function findAndUpdate(arg0: { email: any; }, arg1: { password: string; }) {
  throw new Error("Function not implemented.");
}



//forget password

export const generateOtp=async(req:Request,res:Response)=>{
  try{
    
    const {email}=req.body
    if(!email){
      return res.status(400).json({error:"Email is required"});
    }
    const user=await User.findOne({email:email});
    console.log(user)
    if(!user){
      return res.status(400).json({error:"User not found"});
    }
    console.log("generateOtp")
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const findInDb=await Otp.findOne({userId:user._id});
    if(findInDb){
      console.log("already exist")
      const updateOtp=await Otp.findOneAndUpdate({userId:user._id},{
        otp:otp,
        generatedAt: new Date(),
        expireAt: new Date(Date.now() + 5 * 60 * 1000) // 5 minutes from now
      })
      const sendmail=await sendEmail(
        email,
        "Gym Management - Password Reset OTP",
        `Hello,\n\nYour OTP for password reset is ${otp}.\n\nThis OTP is valid for 5 minutes.\nIf you did not request this, please ignore this email.\n\nRegards,\nGym Management Team`
      );

      return res.status(200).json({message:`OTP sent successfully to ${user.email}`,});
    }
    console.log("new entry in otp")
    const dataotp=await Otp.create({
      userId:user._id,
      otp:otp,
      generatedAt: new Date(),
      expireAt: new Date(Date.now() + 5 * 60 * 1000) // 5 minutes from now
    })
    console.log(dataotp)

    const sendmail=await sendEmail(
      email,
      "Gym Management - Password Reset OTP",
      `Hello,\n\nYour OTP for password reset is ${otp}.\n\nThis OTP is valid for 5 minutes.\nIf you did not request this, please ignore this email.\n\nRegards,\nGym Management Team`
    );

    res.status(200).json({message:`OTP sent successfully to ${user.email}`,});

  }catch(err){
    console.error(err);
    res.status(500).json({error:"Server error"});
  }
}


export const forgotPassword=async(req: Request,res: Response)=>{
  try{
    const {otp,email,newPassword,confirmPassword}=req.body;
    if(!otp || !email || !newPassword){
      return res.status(400).json({error:"All fields are required"});
    }
    if(newPassword!=confirmPassword){
      return res.status(400).json({error:"New password and confirm password do not match"});
    }
    const user=await User.findOne({email:email});
    if(!user){
      return res.status(400).json({error:"User not found"});
    }
    const otpdata=await Otp.findOne({userId:user?._id})
    if(!otpdata){
      return res.status(400).json({error:"OTP not found"});
    }
    console.log("Expire At:", otpdata.expireAt);
    console.log("Current :", new Date());
    console.log("Comparison:", otpdata.expireAt as any < new Date());
    if ((otpdata.expireAt as any).getTime() < Date.now()) {
        return res.status(400).json({
            error: "OTP has expired"
        });
    }

    const checkOtp=await Otp.findOne({userId:user?._id,otp:otp});
    if(!checkOtp){
      return res.status(400).json({error:"Invalid OTP"});
    }
    const salt=Number(process.env.SALT);
    const hashPass=await bcrypt.hash(newPassword,salt);

    const savePass=await User.findOneAndUpdate(
      {email:email},
      {password:hashPass}
    )
    console.log("password saved")
    res.status(200).json({message:"Password updated successfully"});


  }catch(err){
    console.error(err);
    res.status(500).json({error:"Server error"});

  }

}

