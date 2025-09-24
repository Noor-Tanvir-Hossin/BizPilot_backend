
import { Schema, model, Types } from 'mongoose';
import { TIdea } from './idea.interface';

// const checklistSchema = new Schema<TChecklistItem>({
//   title: { type: String, required: true },
//   status: { type: String, enum: ['todo', 'done'], default: 'todo' },
//   order: { type: Number, required: true },
// }, { _id: true });

const ideaSchema = new Schema<TIdea>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', index: true, required: true },
  title: { type: String, required: true, trim: true },
  description: { type: String },
  location: { type: String },
  budget: { type: Number, default: 0 },
//   checklist: { type: [checklistSchema], default: [] },
}, { timestamps: true });

export const Idea = model<TIdea>('Idea', ideaSchema);
