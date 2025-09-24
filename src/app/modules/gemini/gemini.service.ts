import {GoogleGenAI} from '@google/genai';
import AppError from '../../error/AppError';
import { StatusCodes } from 'http-status-codes';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const ai = new GoogleGenAI({apiKey: GEMINI_API_KEY});

const integratingGemeni = async (prompt:any) => {
    const{title, description, location, budget,category} = prompt;
    console.log(description);
    // if (!title || !description || !location || !budget || !category) {
    //     throw new AppError(StatusCodes.UNAUTHORIZED, 'Missing required Fields!');
    //   }
  
    const geminiPrompt = `my business is ${title} and the location is ${location} my budget is ${budget} category i need ${category} ${description}`;
    // console.log(geminiPrompt);
    
    // console.log('payload', prompt);
    const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: geminiPrompt,
      });
    return response.text;
  };

  export const geminiService ={
    integratingGemeni
}