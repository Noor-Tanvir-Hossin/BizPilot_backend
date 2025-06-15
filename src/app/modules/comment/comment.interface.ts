import mongoose, { Document } from "mongoose";


export interface ICommment extends Document{
  text:string
  user: mongoose.Types.ObjectId;
  createdAt: Date;
}