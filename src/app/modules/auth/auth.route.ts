import { Router } from "express";
import { AuthControllers } from "./auth.controller";
import { auth } from "../../middleware/auth";

const authRouter = Router();

// authRouter.post('/register', validateRequest(UserValidation.userValidationSchema), AuthControllers.register);
authRouter.post('/register', AuthControllers.register);
authRouter.post('/verifyAccount',auth, AuthControllers.verifyAccount);

export default authRouter;