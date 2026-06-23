import express from 'express';
import dotenv from 'dotenv';
import {connectDB} from '../database';
import User from './models/User';



dotenv.config();
connectDB();
const app=express();


app.listen(process.env.PORT,()=>{
    console.log(`Server is running on port ${process.env.PORT}`);
})