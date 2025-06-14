import express from 'express';
import { UserControllers } from './user.controller';
import { upload } from '../../middleware/multer';
import { auth } from '../../middleware/auth';

const router = express.Router()

router.get('/:id' ,UserControllers.getUserProfile);
router.post('/edit-profile',auth,upload.single("profilePicture") ,UserControllers.editUserProfile);
router.get('/suggested-user',auth ,UserControllers.suggestedUserProfile);
router.post('/follow-unfollow/:id',auth ,UserControllers.followUnfollow);

export const UserRouter = router;