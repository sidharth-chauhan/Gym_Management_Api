import { Request, Response } from 'express';
import User from '../../models/User';
import Gym from '../../models/Gym';
import Member from '../../models/Member';
import Trainer from '../../models/Trainer';
import membership from '../../models/Membership';
import Payment from '../../models/Payment';




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
    res.status(500).json({error:"Server error"});
  }
}