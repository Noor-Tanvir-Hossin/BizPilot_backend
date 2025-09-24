import express from 'express';
import { auth } from '../../middleware/auth';
import { IdeaController } from './idea.controller';

const router = express.Router()



router.post('/',auth ,IdeaController.createIdea);
router.get('/',auth ,IdeaController.getIdea);

export const IdeaRouter = router;