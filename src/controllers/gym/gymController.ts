import { Request, Response } from 'express';
import User from '../../models/User';




export const getProfile=async (req:Request, res:Response)=>{
  try{
    const user=(req as any).user;
    const userProfile =await User.findById(user._id).select("-password");
    if (!userProfile){
      return res.status(404).json({error:"User not found"});
    }
    return res.status(200).json({message:"User Profile", user:userProfile});
    
    console.log(user);


  }catch(error){
    console.error(error)
  }

}