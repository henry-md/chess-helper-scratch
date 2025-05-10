import { IUser, User } from "../models/User";
import { hash, verify } from "@node-rs/argon2";
import { Router, Request, Response, RequestHandler } from "express";
import { generateToken, verifyToken } from "../utils/jwt";
import logger from "../utils/logger";

const router = Router();

/* Notes
- I typecast async functionas as RequestHandlers both to specify the req object in sign-up and to be able to return non-null values. I want to return for ts type checking, so I don't have to check for null values (ex. user?.username -> user.username)
*/

interface SignUpBody {
  email: string;
  username: string;
  password: string;
}

const hashOptions = {
  memoryCost: 19456,
  timeCost: 2,
  outputLen: 32,
  parallelism: 1,
};

router.post("/sign-up", (async (req: Request<{}, {}, SignUpBody>, res: Response) => {
  try {
    const { email, username, password } = req.body;
    logger.debug(`[Sign Up] Attempting to create user with email: ${email}`);

    const passwordHash = await hash(password, hashOptions);
    logger.debug("[Sign Up] Password hashed successfully");

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      logger.warn(`[Sign Up] User already exists with email: ${email}`);
      res.json({ message: "User already exists" });
    }

    const user: IUser = await User.create({
      email,
      username,
      passwordHash,
    });
    logger.info(`[Sign Up] User created successfully: ${user._id}`);

    // Generate JWT token
    const token = generateToken(user._id);
    logger.debug("[Sign Up] JWT token generated");

    return res.json({
      success: true,
      message: "User signed up successfully",
      user,
      token,
    });
  } catch (error) {
    logger.error("[Sign Up] Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}) as RequestHandler);

router.post("/sign-in", (async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    logger.debug(`[Sign In] Attempting to sign in with email: ${email}`);

    const user = await User.findOne({ email });
    if (!user) {
      logger.warn(`[Sign In] User not found with email: ${email}`);
      return res.status(401).json({
        success: false,
        message: "Incorrect email or password",
      });
    }
    if (!user.username || !user.passwordHash) {
      return res.status(401).json({
        success: false,
        message: "Error retrieving user information",
      });
    }
    logger.debug(`[Sign In] User found w/ username: ${user.username}`);

    logger.debug("[Sign In] Starting password verification...");
    logger.debug(
      `[Sign In] Stored hash: ${user.passwordHash.substring(0, 10)}...`
    );
    logger.debug(`[Sign In] Provided password: ${password.substring(0, 1)}...`);

    const validPassword = await verify(
      user.passwordHash,
      password,
      hashOptions
    );
    logger.debug(`[Sign In] Password verification result: ${validPassword}`);

    if (!validPassword) {
      logger.warn(`[Sign In] Invalid password for user: ${email}`);
      return res.status(401).json({
        success: false,
        message: "Incorrect email or password",
      });
    }
    logger.debug("[Sign In] Password verified successfully");

    // Generate JWT token
    const token = generateToken(user._id);
    logger.debug("[Sign In] JWT token generated");

    logger.info(`[Sign In] User ${user._id} signed in successfully`);
    res.json({
      success: true,
      message: "User signed in successfully",
      user,
      token,
    });
  } catch (error) {
    logger.error("[Sign In] Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}) as RequestHandler);

router.post("/sign-out", async (req: Request, res: Response) => {
  // With JWT, we don't need to do anything on the server side
  // The client should remove the token
  logger.info("[Sign Out] User signed out");
  res.json({
    success: true,
    message: "Signed out successfully",
  });
});

router.get("/validate-token", async (req: Request, res: Response) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  logger.debug(
    `[Validate Token] Received token: ${token ? "Present" : "Missing"}`
  );

  if (!token) {
    logger.warn("[Validate Token] No token provided");
    res.status(401).json({
      success: false,
      message: "No token provided",
    });
  }

  const decoded = verifyToken(token as string);
  if (!decoded) {
    logger.warn("[Validate Token] Invalid token");
    res.status(401).json({
      success: false,
      message: "Invalid token",
    });
    return;
  }
  logger.debug(
    `[Validate Token] Token decoded successfully: ${JSON.stringify(decoded)}`
  );

  const user = await User.findById(decoded.userId);
  if (!user) {
    logger.warn("[Validate Token] User not found for decoded token");
    res.status(401).json({
      success: false,
      message: "User not found",
    });
    return;
  }
  logger.debug(`[Validate Token] User found: ${user.username}`);

  res.json({
    success: true,
    message: "Token is valid",
    user,
  });
});

router.get("/users", async (req: Request, res: Response) => {
  try {
    const users = await User.find();
    logger.debug(`[Users] Retrieved ${users.length} users`);
    res.status(200).json({ users, success: true });
  } catch (error) {
    logger.error("[Users] Error fetching users:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

export default router;
