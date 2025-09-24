
import { Schema, model, Types } from 'mongoose';
import { TCategoryKey, TIdea } from './idea.interface';

// const checklistSchema = new Schema<TChecklistItem>({
//   title: { type: String, required: true },
//   status: { type: String, enum: ['todo', 'done'], default: 'todo' },
//   order: { type: Number, required: true },
// }, { _id: true });

const allowedCategories: TCategoryKey[] = [
    'marketing',
    'Technology',
    'Fashion',
    'Food & Beverage',
    'Health & Wellness',
    'others',
  ];

const ideaSchema = new Schema<TIdea>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', index: true, required: true },
  title: { type: String, required: true, trim: true },
  description: { type: String },
  location: { type: String },
  budget: { type: Number, default: 0 },
  categories: {
    type: [String],
    enum: allowedCategories,  // ⬅️ শুধু এগুলোই allow করবে
    default: [],
    index: true,
  },

}, { timestamps: true });

export const Idea = model<TIdea>('Idea', ideaSchema);
