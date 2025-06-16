import express from 'express';
import { auth } from "../../middleware/auth";
import { postControllers } from "./post.controller";
import { upload } from '../../middleware/multer';

const router = express.Router()

router.post('/',auth ,upload.single('image'),postControllers.createPost);
router.get('/',postControllers.getAllPost);
router.get('/user-post/:id',postControllers.getSingleUserPost);
router.post('/save-unsave/:id',auth,postControllers.saveOrUnSavePost);
router.delete('/delete-post/:id',auth,postControllers.deletePost);
router.post('/like-dislike-post/:id',auth,postControllers.likeOrDislikePost);

export const PostRouter = router;