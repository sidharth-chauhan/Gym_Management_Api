import mongoose, {Document, Schema, Model} from "mongoose"

interface IMember extends Document{
  trainerId: mongoose.Types.ObjectId;
  membershipId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  gymId: mongoose.Types.ObjectId;
  weight?: Number;
  diet?: string;
  dob?: Date;
  status: "ACTIVE" | "INACTIVE" | "SUSPENDED";
  joinedDate: Date;
  membershipEndDate: Date;
}

const memberSchema=new Schema<IMember>({
  trainerId:{
    type: Schema.Types.ObjectId,
    ref: "Trainer",
    required: true
  },
  membershipId:{
    type: Schema.Types.ObjectId,
    ref: "Membership",
    required: true
  },
  userId:{
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  gymId:{
    type: Schema.Types.ObjectId,
    ref: "Gym",
    required: true
  },
  weight:{
    type: Number
  },
  diet:{
    type: String
  },
  dob:{
    type: Date
  },
  status:{
    type: String,
    enum: ["ACTIVE","INACTIVE","SUSPENDED"],
    default: "ACTIVE"
  },
  joinedDate:{
    type: Date,
    required: true
  },
  membershipEndDate:{
    type: Date,
    required: true
  }
},{timestamps:true})


const Member= mongoose.model<IMember>('Member',memberSchema);
export default Member;



















