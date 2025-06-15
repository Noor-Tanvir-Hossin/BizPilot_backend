import express from 'express';
import { auth } from "../../middleware/auth";
import { postControllers } from "./post.controller";
import { upload } from '../../middleware/multer';

const router = express.Router()

router.post('/',auth ,upload.single('image'),postControllers.createPost);

export const PostRouter = router;