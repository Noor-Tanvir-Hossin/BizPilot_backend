import { Types } from "mongoose";
import { Idea } from "./idea.model";
import { TIdea } from "./idea.interface";

const createIdeaToDB = async (userId: string, payload: Partial<TIdea>) => {
  console.log('payload', payload);
  const result = await Idea.create({
    userId: new Types.ObjectId(userId),
    title: payload.title!,
    description: payload.description,
    location: payload.location,
    budget: payload.budget ?? 0,
    // checklist: defaultChecklist(),
  });
  return result;
};
const getIdeaFromDB = async (userId: string) => {

  const result = await Idea.find({userId: new Types.ObjectId(userId)})
  return result;
};



export const IdeaService ={
	  createIdeaToDB,
	  getIdeaFromDB
}