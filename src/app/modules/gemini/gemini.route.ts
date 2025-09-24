import express from 'express';
import { geminiController } from './gemini.controller';

const router = express.Router()



router.post('/', geminiController.itegrateGemini);

export const GeminiRouter = router;