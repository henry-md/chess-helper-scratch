import { initializeLucia } from "../db/auth.js";

const lucia = await initializeLucia();

export const auth = async (req, res, next) => {
  console.log('in auth');
  const cookie = req.header("Cookie") ?? "";
  const sessionId = lucia.readSessionCookie(cookie);

  if (!sessionId) {
    req.user = null;
    req.session = null;
    return next();
  }

  // Bug: Lucia being weird
  console.log('auth: sessionId', sessionId);
  const { session, user } = await lucia.validateSession(sessionId);
  console.log('auth: session', session, 'user', user);

  // Clearing Old Session
  if (!session) {
    const blankSessionCookie = lucia.createBlankSessionCookie();
    res.header("Set-Cookie", blankSessionCookie.serialize(), {
      append: true,
    });
  }

  // Session Rotation
  if (session && session.fresh) {
    const sessionCookie = lucia.createSessionCookie(session.id);
    res.header("Set-Cookie", sessionCookie.serialize(), {
      append: true,
    });
  }

  console.log('setting here');
  req.session = session;
  req.user = user;
  console.log('req.user', req.user);
  
  // pretend auth middleware and lucia are actually doing their job
  req.userId = '6759cd9ef7a87ee3ba2f8ebf';
  return next();
};
