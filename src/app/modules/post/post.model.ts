import { Schema, model } from 'mongoose';
import { IPost } from './post.interface';

const postSchema = new Schema<IPost>(
  {
    caption: {
      type: String,
      maxlength: [2200, 'Caption should be less then 2200 characters'],
      trim: true,
    },
    image: {
      url: { type: String, required: true },
      publicId: { type: String, required: true },
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Comment',
      },
    ],

  },
  {
    timestamps: true,
  },
);

postSchema.index({user: 1, createdAt:-1})

export const Post = model<IPost>('Post', postSchema);
