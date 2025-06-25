import express from 'express';
import { UserControllers } from './user.controller';
import { upload } from '../../middleware/multer';
import { auth } from '../../middleware/auth';

const router = express.Router()

router.get('/suggested-user',auth ,UserControllers.suggestedUserProfile);
router.get('/profile/:id' ,UserControllers.getUserProfile);
router.post('/edit-profile',auth,upload.single("profilePicture") ,UserControllers.editUserProfile);

router.post('/follow-unfollow/:id',auth ,UserControllers.followUnfollow);
router.get('/me',auth ,UserControllers.getMe);

export const UserRouter = router;