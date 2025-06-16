import mongoose, { Document } from "mongoose";


export interface IPost extends Document{
  caption?: string; // optional because no `required: true` in schema
  image: {
    url: string;
    publicId: string;
  };
  user: mongoose.Types.ObjectId;
  likes: mongoose.Types.ObjectId[];
  comments: mongoose.Types.ObjectId[];
  createdAt: Date;
}