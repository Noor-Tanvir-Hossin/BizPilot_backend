import { StatusCodes } from "http-status-codes";
import AppError from "../error/AppError";
import catchAsync from "../utils/cathchAsync";
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from "../config";
import { User } from "../modules/user/user.model";

export const auth= catchAsync(async (req, res, next) => {
    const token = req.headers.authorization;
    // checking if the token is missing
    if (!token) {
      throw new AppError(StatusCodes.UNAUTHORIZED, 'You are not authorized!');
    }

    // checking if the given token is valid
    const decoded = jwt.verify(
      token,
      config.jwt_access_token as string,
    ) as JwtPayload ;


    const { email} = decoded ;

    // checking if the user is exist
  const user = await User.findOne({ email });

  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND,'This user is not found !' )
  }

    const { iat } = decoded;
    const passwordChangedTime = new Date(user?.passwordChangeAt).getTime() / 1000;
  if (passwordChangedTime > iat!) {
    throw new AppError(StatusCodes.UNAUTHORIZED, 'user token not valid');
  }
    

    // req.user = decoded as JwtPayload uu;
    req.user = user;
    next();
  });