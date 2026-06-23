import mongoose, { Document, Schema,model } from "mongoose";

interface IUser extends Document {
  name: string;
  email: string;
  role: string;
  password: string;
  phoneNumber?: string;
}

const userSchema= new Schema<IUser>({
  name:{
    type:String,
    required:true
  },
  email:{
    type:String,
    required: true,
    unique: true,
    lowercase: true,
  },
  role:{
    type: String,
    enum: ["OWNER","TRAINER","MEMBER"],
    required: true,
  },
  password:{
    type: String,
    required: true,
  },
  phoneNumber:{
    type: String,
    unique: true,
  }
},{timestamps:true}
);

//userSchema.index({ email: 1});

const User = mongoose.model<IUser>('User', userSchema);

export default User;