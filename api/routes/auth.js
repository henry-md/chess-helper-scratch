import { User } from "../models/User.js";
import { hash, verify } from "@node-rs/argon2";
import { Router } from "express";
import { generateToken, verifyToken } from "../utils/jwt.js";
import logger from "../utils/logger.js";

const authRouter = Router();

const hashOptions = {
  memoryCost: 19456,
  timeCost: 2,
  outputLen: 32,
  parallelism: 1,
};

authRouter.post("/sign-up", async (req, res) => {
  try {
    const { email, username, password } = req.body;
    logger.debug(`[Sign Up] Attempting to create user with email: ${email}`);

    const passwordHash = await hash(password, hashOptions);
    logger.debug("[Sign Up] Password hashed successfully");

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      logger.warn(`[Sign Up] User already exists with email: ${email}`);
      return res.json({ message: "User already exists" });
    }

    const user = await User.create({
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
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

authRouter.post("/sign-in", async (req, res) => {
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
    logger.debug(`[Sign In] User found: ${user.username}`);

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
    return res.json({
      success: true,
      message: "User signed in successfully",
      user,
      token,
    });
  } catch (error) {
    logger.error("[Sign In] Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

authRouter.post("/sign-out", async (req, res) => {
  // With JWT, we don't need to do anything on the server side
  // The client should remove the token
  logger.info("[Sign Out] User signed out");
  return res.json({
    success: true,
    message: "Signed out successfully",
  });
});

authRouter.get("/validate-token", async (req, res) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  logger.debug(
    `[Validate Token] Received token: ${token ? "Present" : "Missing"}`
  );

  if (!token) {
    logger.warn("[Validate Token] No token provided");
    return res.status(401).json({
      success: false,
      message: "No token provided",
    });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    logger.warn("[Validate Token] Invalid token");
    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
  logger.debug(
    `[Validate Token] Token decoded successfully: ${JSON.stringify(decoded)}`
  );

  const user = await User.findById(decoded.userId);
  if (!user) {
    logger.warn("[Validate Token] User not found for decoded token");
    return res.status(401).json({
      success: false,
      message: "User not found",
    });
  }
  logger.debug(`[Validate Token] User found: ${user.username}`);

  return res.json({
    success: true,
    message: "Token is valid",
    user,
  });
});

authRouter.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    logger.debug(`[Users] Retrieved ${users.length} users`);
    res.status(200).json({ users, success: true });
  } catch (error) {
    logger.error("[Users] Error fetching users:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

export default authRouter;
