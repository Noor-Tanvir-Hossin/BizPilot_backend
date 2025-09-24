import { Types } from 'mongoose';

// export type TChecklistItem = {
//   _id?: Types.ObjectId;
//   title: string;
//   status: 'todo' | 'done';
//   order: number;
// };

export type TCategoryKey =
  | 'marketing'
  | 'Technology'
  | 'Fashion'
  | 'Food & Beverage'
  | 'Health & Wellness'
  | 'others';



export type TIdea = {
  userId: Types.ObjectId;
  title: string;
  description?: string;
  location?: string;
  budget?: number;
  categories: TCategoryKey[];
  createdAt?: Date;
  updatedAt?: Date;
};
