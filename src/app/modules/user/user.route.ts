import express from 'express';
import { UserControllers } from './user.controller';
import { upload } from '../../middleware/multer';
import { auth } from '../../middleware/auth';

const router = express.Router()

router.get('/:id' ,UserControllers.getUserProfile);
router.post('/editProfile',auth,upload.single("profilePicture") ,UserControllers.editUserProfile);

export const UserRouter = router;