import { User, IUser } from '../models/user';

interface RequestUser {
  id: string;
  username: string;
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: RequestUser;
    }
  }
}

export { RequestUser };
