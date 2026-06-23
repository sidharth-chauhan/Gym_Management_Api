import mongoose, { Document, Schema, model } from "mongoose";

interface IGym extends Document{
  name: string;
  address: string;
  gymType: "MALE" | "FEMALE" | "UNISEX";
  ownerId: mongoose.Types.ObjectId;
}

const gym=new Schema<IGym>({
  name:{
    type: String,
    required: true
  },
  address:{
    type: String,
    required:true,
    unique: true
  },
  gymType:{
    type: String,
    enum: ["MALE","FEMALE","UNISEX"],
  },
  ownerId:{
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
},{timestamps:true})


const Gym=mongoose.model<IGym>('Gym',gym);

export default Gym;