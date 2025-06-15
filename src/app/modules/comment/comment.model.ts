import { Schema, model } from 'mongoose';
import { ICommment } from './comment.interface';

const commetSchema = new Schema<ICommment>(
  {
    text:{
      type: String,
      required:[true, "comment text is required"],
      trim:true
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    
    
    createdAt:{
        type:Date,
        default:Date.now()
    }
  },
  {
    timestamps: true,
  },
);



export const User = model<ICommment>('Comment', commetSchema);
