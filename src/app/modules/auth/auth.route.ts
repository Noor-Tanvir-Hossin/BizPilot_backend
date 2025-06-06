import { Router } from "express";
import { AuthControllers } from "./auth.controller";

const authRouter = Router();

// authRouter.post('/register', validateRequest(UserValidation.userValidationSchema), AuthControllers.register);
authRouter.post('/register', AuthControllers.register);

export default authRouter;