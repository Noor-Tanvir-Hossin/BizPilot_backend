import { Router } from "express";
import { AuthControllers } from "./auth.controller";
import { auth } from "../../middleware/auth";

const authRouter = Router();

// authRouter.post('/register', validateRequest(UserValidation.userValidationSchema), AuthControllers.register);
authRouter.post('/register', AuthControllers.register);
authRouter.post('/verifyAccount',auth, AuthControllers.verifyAccount);
authRouter.post('/resendOtp',auth, AuthControllers.resendOtp);
authRouter.post('/login', AuthControllers.login);
authRouter.post('/forgetPassword', AuthControllers.forgetPassword);
authRouter.post('/resetPassword', AuthControllers.resetPassword);
authRouter.post('/changePassword',auth, AuthControllers.changePassword);
authRouter.post(
    '/refresh-token',
    AuthControllers.refreshToken,
  );

export default authRouter;