import { NextFunction } from "express";
import User from "../models/User";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";


export const generateToken = async (userId : string) =>{
  try{
    const user= await User.findById(userId).select("-password");

    if(!user){
      return null;
    }
    const payload={
      userId: user._id,
      userName: user.name,
      userRole: user.role
    }

    const jwt_secret=String(process.env.JWT_SECRET);

    const signedToken= jwt.sign(
      payload,
      jwt_secret,
      {expiresIn: "30d"}

    )
    return signedToken;

  }catch(err){
    console.error(err);
    return null;
  }
}


export const verifyToken= async(req: Request,res: Response,next: NextFunction)=>{
  try{
    const token=req.headers.authorization?.split(" ")[1];

    if(!token){
      return res.status(401).json({error:"No token provided"});
    }

    const jwt_secret=String(process.env.JWT_SECRET);

    const verified= jwt.verify(token,jwt_secret) as {userId: string, userName: string, userRole: string};
    

    const user= await User.findById(verified.userId).select("-password");
    if(!user){
      return res.status(401).json({error:"User not found"});
    }

    (req as any).user = user;
    return next();


  }catch(err){
    console.error(err);
    res.status(401).json({error:"Server error"});
  }
  
}

