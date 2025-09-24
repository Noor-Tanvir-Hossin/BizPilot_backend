import { Types } from 'mongoose';

// export type TChecklistItem = {
//   _id?: Types.ObjectId;
//   title: string;
//   status: 'todo' | 'done';
//   order: number;
// };

export type TIdea = {
  userId: Types.ObjectId;
  title: string;
  description?: string;
  location?: string;
  budget?: number;
//   checklist: TChecklistItem[];
  createdAt?: Date;
  updatedAt?: Date;
};
