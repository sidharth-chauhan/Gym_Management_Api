import mongoose, { Schema } from "mongoose";


interface IOtp extends Document{
  userId: mongoose.Types.ObjectId;
  otp: string;
  generatedAt?: Date;
  expireAt?: Date;
}

const otpSchema=new mongoose.Schema<IOtp>({
  userId:{
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true

  },
  otp:{
    type: String,
    required: true

  },
  generatedAt:{
    type: Date,
    default: Date.now

  },
  expireAt:{
    type: Date,
    default: Date.now() + 5 * 60 * 1000 // 5 minutes from now

  }

})

const Otp =mongoose.model<IOtp>('Otp',otpSchema);
export default Otp;