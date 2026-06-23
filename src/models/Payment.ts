import mongoose,{Document,Schema,Model} from "mongoose";

interface IPayment extends Document{
  method: "CREDIT_CARD" | "DEBIT_CARD" | "PAYPAL" | "CASH";
  memberId: mongoose.Types.ObjectId;
  amount: number;
  paymentDate: Date;
  status: "PAID" | "PENDING" | "FAILED";
  gymId: mongoose.Types.ObjectId;
}

const paymentSchema=new Schema<IPayment>({
  method:{
    type: String,
    enum: ["CREDIT_CARD","DEBIT_CARD","PAYPAL","CASH"],
    required: true
  },
  memberId:{
    type: Schema.Types.ObjectId,
    ref: "Member",
    required: true
  },
  amount:{
    type: Number,
    required: true
  },
  paymentDate:{
    type: Date,
    required: true
  },
  status:{
    type: String,
    enum: ["PAID","PENDING","FAILED"],
    required: true
  },
  gymId:{
    type: Schema.Types.ObjectId,
    ref: "Gym",
    required: true
  }
},{timestamps:true});


const payment= mongoose.model<IPayment>('Payment',paymentSchema);
export default payment;