import express from 'express';
import dotenv from 'dotenv';
import {connectDB} from '../database';
import User from './models/User';
import authRoutes from './Routes.ts/authRoutes';



dotenv.config();
connectDB();
const app=express();
app.use(express.json());

app.use("/api/user",authRoutes) 


app.listen(process.env.PORT,()=>{
    console.log(`Server is running on port ${process.env.PORT}`);
})