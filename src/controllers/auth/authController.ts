import bcrypt from "bcrypt";
import User from "../../models/User";
import Gym from "../../models/Gym";
import {Request,Response} from "express";
import dotenv from "dotenv";
import { generateToken } from "../../utils/jwt";

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


export const hello= async(req:Request,res:Response)=>{
  const payload = (req as any).user;
  console.log(payload);
  res.status(200).json({message:"Hello",user:payload});
}