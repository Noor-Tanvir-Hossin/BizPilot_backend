import mongoose, { Document } from "mongoose";


export interface ICommment extends Document{
  user: mongoose.Types.ObjectId;
  createdAt: Date;
}