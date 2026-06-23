import mongoose ,{Document, Schema,Model} from "mongoose";



interface IMembership extends Document{
  gymId: mongoose.Types.ObjectId;
  planName: string;
  durationInMonth: number;
  price: number;
}

const membershipSchema= new Schema<IMembership>({
  gymId:{
    type: Schema.Types.ObjectId,
    ref: "Gym",
    required: true
  },
  planName:{
    type: String,
    required: true
  },
  durationInMonth:{
    type: Number,
    required: true
  },
  price:{
    type: Number,
    required: true
  }
},{timestamps:true});

const membership=mongoose.model<IMembership>('Membership',membershipSchema);
export default membership;