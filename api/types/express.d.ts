import { StoredUser } from '@/types/chess';

declare global {
  namespace Express {
    interface Request {
      user?: StoredUser | null;
    }
  }
}
