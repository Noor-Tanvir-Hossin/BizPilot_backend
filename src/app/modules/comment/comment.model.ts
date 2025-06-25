import { Schema, model } from 'mongoose';
import { ICommment } from './comment.interface';

const commentSchema = new Schema<ICommment>(
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
    
  },
  {
    timestamps: true,
  },
);



export const Comment = model<ICommment>('Comment', commentSchema);
