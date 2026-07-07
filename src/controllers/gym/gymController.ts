import { Request, Response } from 'express';
import User from '../../models/User';
import Gym from '../../models/Gym';
import Member from '../../models/Member';
import Trainer from '../../models/Trainer';
import membership from '../../models/Membership';
import Payment from '../../models/Payment';
import Membership from '../../models/Membership';
import bcrypt from "bcrypt";
import { spec } from 'node:test/reporters';
import { clear } from 'node:console';






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
    if(!user){
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
    if(!user){
      return res.status(403).json({error:"Access denied"});
    }
    const gymId=await Gym.findById(user._id)
    if(!gymId){
      return res.status(404).json({error:"Gym not found"});
    }

    const id=req.params.id;
    const membership=await Membership.findOne({_id:id,gymId:gymId?._id});
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
    if(user.role!=="OWNER"){
      return res.status(403).json({error:"Access denied"});
    }
    const membershipId=req.params.id
    console.log("1")
    const gymId=await Gym.findById(user._id)
    if(!gymId){
      return res.status(404).json({error:"Gym not found"});
    }

    const membership=await Membership.findOne({_id:membershipId,gymId:gymId?._id})
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


export const removeMembership=async (req: Request,res:Response)=>{
  try{
    console.log("removeMembership")
    const user=(req as any).user
    if(user.role!=="OWNER"){
      return res.status(403).json({error:"Access denied"});
    }
    const membershipId=req.params.id
    console.log(user)
    const gym = await Gym.findOne({ ownerId: user._id })
    if(!gym){
      return res.status(404).json({error:"Gym not found"});
    }

    const membershipData= await Membership.findOneAndDelete({
      _id: membershipId,
      gymId:gym._id

    })
    if(!membershipData){
      return res.status(404).json({error:"Membership not find"});
    }
    res.status(200).json({message:"Delete Sucessfully",data:membershipData})

  }catch(err){
    res.status(500).json({error:"Server error",err});
  }
}



export const addTrainer=async (req:Request,res:Response)=>{
  try{
    const {name,email,password,phoneNumber,experienceInMonth,specialization}=req.body;
    console.log(req.body);
    const owner=(req as any).user;
    if(owner.role!=="OWNER"){
      return res.status(403).json({error:"Access denied"});
    }
    
    
    if(!name || !email || !password  || !experienceInMonth ){
      return res.status(400).json({error:"All fields are required"});
    }
    const gymId=await Gym.findOne({ownerId:owner._id});
    const salt=Number(process.env.SALT);
    const hashpass=await bcrypt.hash(password,salt);
    const find=await User.findOne({email:email});
    if(find){
      return res.status(400).json({error:"User already exists"});
    }
    const user=await User.create({
      name,
      email,
      role:"TRAINER",
      password: hashpass,
      phoneNumber
    })

    const trainer=await Trainer.create({
      experienceInMonth,
      gymId: gymId?._id,
      userId: user._id,
      specialization: specialization,
      joinedDate: new Date()
    })
    if(!trainer){
      return res.status(400).json({error:"Trainer not created"});
    }
    const data=await Trainer.findById(trainer._id).populate("userId","-password");
    res.status(201).json({message:"Trainer added successfully",Trainer:data});



  }catch(err){
    console.error(err);
    res.status(500).json({error:"Server error",err});
  }
}


export const getTrainer=async(req:Request,res:Response)=>{
  try{
    const user=(req as any).user;
    if(!user){
      return res.status(403).json({error:"Access denied"});
    }
    const gymId=await Gym.findOne({ownerId:user._id});
    if(!gymId){
      return res.status(404).json({error:"Gym not found"});
    }
    const trainers=await Trainer.find({gymId:gymId._id}).populate("userId","-password");
    const trainerData=trainers.map((trainer)=>{
      return{
        _id:trainer._id,
        name: (trainer.userId as any).name,
        experienceInMonth: trainer.experienceInMonth,
        specialization: trainer.specialization,
      }
    }) 
    res.status(200).json({message:"Trainers",data:trainerData});


  }catch(err){
    console.error(err);
    res.status(500).json({error:"Server error",err});
  }
}




export const getTrainerById=async(req:Request,res:Response)=>{
  try{
    const user=(req as any).user;
    if(!user){
      return res.status(403).json({error:"Access denied"});
    }
    const trainerId=req.params.id;
    if(!trainerId){
      return res.status(400).json({error:"Trainer id is required"});
    }
    const trainer=await Trainer.findById(trainerId).populate("userId","-password");

    if(!trainer){
      return res.status(404).json({error:"Trainer not found"});
    }
    const data={
      trainer_id: trainer._id,
      name: (trainer.userId as any).name,
      email: (trainer.userId as any).email,
      phoneNumber: (trainer.userId as any).phoneNumber,
    }
    
    res.status(200).json({message:"Trainer",data:data});

  }catch(err){
    console.error(err);
    res.status(500).json({error:"Server error",err});
  }
}





export const updateTrainer=async(req:Request,res:Response)=>{
  try{
    let {experienceInMonth,specialization}=req.body;
    const user=(req as any).user;
    if(user.role!=="OWNER"){
      return res.status(403).json({error:"Access denied"});
    }
    if(!experienceInMonth && !specialization){
      return res.status(400).json({error:"At least one field is required"});
    }
    const trainerId=req.params.id;
    const trainer=await Trainer.findById(trainerId);
    if(experienceInMonth===undefined){
      experienceInMonth=trainer?.experienceInMonth
    }
    if(specialization===undefined){
      specialization=trainer?.specialization
    }

    const data=await Trainer.findByIdAndUpdate(
      trainerId,
      {
        experienceInMonth,
        specialization
      },
      {
        new:true
      }
    ).populate("userId","-password");
    

    res.status(200).json({message:"Trainer updated successfully"});


  }catch(err){
    console.error(err);
    res.status(500).json({error:"Server error",err});
  }
}




export const removeTrainer=async(req:Request,res:Response)=>{
  try{
    const user=(req as any).user;
    if(user.role!=="OWNER"){
      return res.status(403).json({error:"Access denied"});
    }
    const trainerId=req.params.id;
    const trainer=await Trainer.findByIdAndDelete(trainerId);
    console.log(trainer);
    await User.findByIdAndDelete(trainer?.userId);

    if(!trainer){
      return res.status(404).json({error:"Trainer not found"});
    }
    res.status(200).json({message:"Trainer removed successfully"});

  }catch(err){
    console.error(err);
    res.status(500).json({error:"Server error",err});
  }
}



export const addMember=async(req:Request,res:Response)=>{
  try{
    const {name,email,password,phoneNumber,trainerId,membershipId,weight,diet,dob}=req.body

    if(!name || !email || !password || !trainerId || !membershipId){
      return res.status(400).json({error:"All fields are required"});
    }
    const owner=(req as any).user;
    if(!owner){
      return res.status(403).json({error:"Access denied"});
    }
    const gymId=await Gym.findOne({ownerId:owner._id});

    if(await User.findOne({email:email})){
      return res.status(400).json({error:"User already exists"});
    }
    const salt=Number(process.env.SALT);
    const hashpass=await bcrypt.hash(password,salt); 

    const user=await User.create({
      name,
      email,
      role:"MEMBER",
      password: hashpass,
      phoneNumber
    })
    const membership=await Membership.findById(membershipId);
    const joinedDate=new Date();
    const membershipEndDate=new Date(joinedDate.getTime() + membership!.durationInMonth * 30 * 24 * 60 * 60 * 1000);
    const member=await Member.create({
      trainerId,
      membershipId,
      userId:user._id,
      gymId:gymId?._id,
      weight,
      diet,
      dob,
      status:"ACTIVE",
      joinedDate,
      membershipEndDate
    })
    const data={
      memberId: member._id,
      name: user.name,
      userId: user._id,
    }
    res.status(201).json({message:"Member added successfully",member: data});

  }catch(err){
    console.error(err);
    res.status(500).json({error:"Server error",err});
  }
}



export const getMembers=async(req:Request,res:Response)=>{
  try{
    const user=(req as any).user;
    if(user.role!=="OWNER"){
      return res.status(403).json({error:"Access denied"});
    }

    const gymId=await Gym.findOne({ownerId:user._id});
    if(!gymId){
      return res.status(404).json({error:"Gym not found"});
    }
    const members=await Member.find({gymId:gymId._id}).populate("userId","-password").populate("trainerId","-password").populate("membershipId");

    
    
    console.log(members);
    const data=await Promise.all(
      members.map(async (member)=>{
      const trainerName=await User.findById((member.trainerId as any).userId).select("name");
      return{
        userId:(member.userId as any)._id,
        name:(member.userId as any).name,
        trainerId:(member.trainerId as any)._id,
        trainerIdName:trainerName?.name,
        membershipId:(member.membershipId as any)._id,
        membershipPlanName:(member.membershipId as any).planName,
      }
    }))
    console.log(data);
    res.status(200).json({message:"Members",data:data});

  }catch(err){
    console.error(err);
    res.status(500).json({error:"Server error",err});
  }
}


export const getMemberById=async(req:Request,res:Response)=>{
  try{
    const memberId=req.params.id;
    const owner=(req as any).user;
    if(owner.role!=="OWNER"){
      return res.status(403).json({error:"Access denied"});
    }
    if(!memberId){
      return res.status(400).json({error:"Member id is required"});
    }
    const member=await Member.findById(memberId).populate("userId","-password").populate("trainerId").populate("membershipId");
    console.log(member);
    const trainerName=await User.findById((member?.trainerId as any).userId).select("name");
    const data={
      memberId: member?._id,
      userId: (member?.userId as any)._id,
      memberName: (member?.userId as any).name,
      trinerId: (member?.trainerId as any)._id,
      trainerName: trainerName?.name,
      membershipId: (member?.membershipId as any)._id,
      membershipPlanName: (member?.membershipId as any).planName,
      membershipEndDate: member?.membershipEndDate
    }
    console.log(data);
    res.status(200).json({message:"Member",data:data});

  }catch(err){
    console.error(err);
    res.status(500).json({error:"Server error",err});
  }
}


export const updateMember=async(req:Request,res:Response)=>{
  try{
    const {trainerId,membershipId,weight,diet}=req.body;
    const user=(req as any).user;
    const memberId=req.params.id;
    if(user.role!=="OWNER"){
      return res.status(403).json({error:"Access denied"});
    }

    if(trainerId && await Trainer.findById(trainerId)===null){
      return res.status(404).json({error:"Trainer not found"});
    }
    if(membershipId && await Membership.findById(membershipId)===null){
      return res.status(404).json({error:"Membership plan not found"});
    }
    const update=await Member.findByIdAndUpdate(
      memberId,
      {
        trainerId,
        membershipId,
        weight,
        diet
      },
      {
        new:true
      }

    )
    res.status(200).json({message:"Member updated successfully",data:update});


  }catch(err){
    console.error(err);
    res.status(500).json({error:"Server error",err});
  }
}


export const removeMember=async(req:Request,res:Response)=>{
  try{
    const user=(req as any).user;
    const memberId=req.params.id;
    if(user.role!=="OWNER"){
      return res.status(403).json({error:"Access denied"});
    }
    const member=await Member.findByIdAndDelete(memberId);
    const userDelete=await User.findByIdAndDelete(member?.userId);

    if(!member){
      return res.status(404).json({error:"Member not found"});
    }
    res.status(200).json({message:"Member removed successfully"});
  }catch(err){
    console.error(err);
    res.status(500).json({error:"Server error",err});
  }
}