import { HydratedDocument } from 'mongoose';
import { JwtPayload } from 'jsonwebtoken';
import { Tuser } from './src/app/modules/user/user.interface';

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload |  HydratedDocument<Tuser>;
    }
  }
}