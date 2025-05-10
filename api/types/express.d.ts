import { User, IUser } from '../models/user';

declare global {
  namespace Express {
    interface Request {
      user?: IUser | null;
    }
  }
}
