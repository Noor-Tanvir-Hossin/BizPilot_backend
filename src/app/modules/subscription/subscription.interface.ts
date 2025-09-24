import { Types } from 'mongoose';

export type TSubscription = {
  userId: Types.ObjectId;
  plan: 'free' | 'pro';
  status: 'inactive' | 'active';
  startedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
};
