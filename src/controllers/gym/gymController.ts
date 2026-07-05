import { Request, Response } from 'express';
import User from '../../models/User';
import Gym from '../../models/Gym';
import Member from '../../models/Member';
import Trainer from '../../models/Trainer';
import membership from '../../models/Membership';
import Payment from '../../models/Payment';
import Membership from '../../models/Membership';




export const getProfile=async (req:Request, res:Response)=>{
  try{
    const user=(req as any).user;
    const userProfile =await User.findById(user._id).select("-password");
    if (!userProfile){
      return res.status(404).json({error:"User not found"});
    }
    console.log(user);
    return res.status(200).json({message:"User Profile", user:userProfile});
    

  }catch(error){
    console.error(error)
  }

}

export const dashboard=async (req:Request,res:Response)=>{
  try{
    const user=(req as any).user;
    
    if(user.role!=="OWNER"){
      return res.status(403).json({error:"Access denied"});
    }
    const gymId= await Gym.findOne({ownerId:user._id})
    if (!gymId){
      return res.status(404).json({error:"Gym not found"});
    }
  
    const membersCount= await Member.countDocuments({gymId:gymId._id});
    const trainersCount= await Trainer.countDocuments({gymId:gymId._id});
    const membershipsCount= await membership.countDocuments({gymId:gymId._id});

    let totalRevenue: any= await Payment.aggregate([
      {
        $match:{gymId:gymId._id}
      },
      {
        $group:{
          _id:null,
          totalAmount:{
            $sum:"$amount"
          }
        }
      }
    ])
    let totalAmount =totalRevenue[0]?.totalAmount || 0;
    console.log(totalAmount);

    res.status(200).json({
      message:"Dashboard data",
      data:{
        membersCount,
        trainersCount,
        membershipsCount,
        totalRevenue:totalAmount
      }
    })

  }catch(err){
    console.error(err);
    res.status(500).json({error:"Server error",err});
  }
}


export const addMembership=async (req:Request,res:Response)=>{
  try{
    const user=(req as any).user;
    if(user.role!=="OWNER"){
      return res.status(403).json({error:"Access denied"});
    }
    const gymId=await Gym.findOne({ownerId:user._id});
    if(!gymId){
      return res.status(404).json({error:"Gym not found"});
    }
    const {planName,durationInMonth,price}=req.body;
    if(!planName || !durationInMonth || !price){
      return res.status(400).json({error:"All fields are required"});
    }
    const data=await Membership.create({
      planName,
      durationInMonth,
      price,
      gymId:gymId?._id
      
    })
    res.status(201).json({message:"Membership plan added successfully",data});
  }catch(err){
    console.error(err);
    res.status(500).json({error:"Server error",err},);
  }
}

export const getMemberships=async (req:Request,res:Response)=>{
  try{
    const user=(req as any).user;
    if(user.role!=="OWNER"){
      return res.status(403).json({error:"Access denied"});
    }
    const gymId=await Gym.findOne({ownerId:user._id});
    if(!gymId){
      return res.status(404).json({error:"Gym not found"});
    }
    const memberships=await Membership.find({gymId:gymId._id});
    console.log(memberships);
    res.status(200).json({message:"Membership plans",data:memberships});


  }catch(err){
    console.error(err);
    res.status(500).json({error:"Server error",err});
  }
}

export const getMembershipById=async (req:Request,res:Response)=>{
  try{
    const user=(req as any).user;
    if(user.role!=="OWNER"){
      return res.status(403).json({error:"Access denied"});
    }

    const id=req.params.id;
    const membership=await Membership.findById({_id:id});
    if(!membership){
      return res.status(404).json({error:"Membership plan not found"});
    }
    res.status(200).json({message:"Membership plan",data:membership});

  }catch(err){
    console.error(err);
    res.status(500).json({error:"Server error",err});
  }
}


export const updateMembership=async (req:Request,res:Response)=>{
  try{
    let {planName,price}=req.body
    const user=(req as any).user
    const membershipId=req.params.id
    console.log("1")

    const membership=await Membership.findById(membershipId)
    console.log("2")
    if(planName===undefined){
      planName=membership?.planName
    }
    if(price===undefined){
      price=membership?.price
    }
    console.log("3")
    const data=await Membership.findByIdAndUpdate(
      membershipId,
      {
        planName,
        price
      },
      {
        new:true
      }
    )
    res.status(200).json({message:"updated sucessfully",data: data})

  }catch(err){
    console.log(err)
    res.status(500).json({error:"Server error",err});
  }

}