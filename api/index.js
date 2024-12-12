import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.js';
import pgnRoutes from './routes/pgn.js';
import { auth } from './middleware/auth.js';

dotenv.config();
const app = express();
const { MONGO_URL, PORT } = process.env;

mongoose
  .connect(MONGO_URL, {
    dbName: "chess-helper",
  })
  .then(() => console.log("MongoDB is  connected successfully"))
  .catch((err) => console.error(err));

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

app.use(
  cors({
    origin: true, // ["*"] or ["http://localhost:5174"]
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(cookieParser());

app.use(express.json());

// Add a general request logger
app.use((req, res, next) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(
      `${req.method} ${req.url} - ${res.statusCode} ${duration}ms`
    );
  });
  
  next();
});

app.use("/hello", (req, res) => {
  res.json({
    message: "Hello there!",
  });
});
app.use(auth);
app.use("/", authRoutes);
app.use("/", pgnRoutes);

