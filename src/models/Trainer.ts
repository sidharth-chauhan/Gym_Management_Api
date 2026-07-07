import mongoose, { Document, Schema, model } from "mongoose";


interface ITrainer extends Document{
  joinedDate: Date;
  experienceInMonth: number;
  gymId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  specialization?: string;
}

const trainerSchema=new Schema<ITrainer>({
  joinedDate:{
    type: Date,
    required: true
  },
  experienceInMonth:{
    type: Number,
    required: true
  },
  gymId:{
    type: Schema.Types.ObjectId,
    ref: "Gym",
    required: true
  },
  userId:{
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  specialization:{
    type: String
  }
},{timestamps:true})

const Trainer= mongoose.model<ITrainer>('Trainer',trainerSchema);
export default Trainer;