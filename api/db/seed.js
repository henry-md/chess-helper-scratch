import mongoose from "mongoose";
import { User } from "../models/User.js";
import { Pgn } from "../models/Pgn.js";
import { hash } from "@node-rs/argon2";
import dotenv from "dotenv";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

// Get the directory path for the current module
const __dirname = dirname(fileURLToPath(import.meta.url));
// Load .env from the root directory
dotenv.config({ path: join(__dirname, "../.env") });

const { MONGO_URL } = process.env;

if (!MONGO_URL) {
  console.error("MONGO_URL is not defined in environment variables");
  process.exit(1);
}

const hashOptions = {
  memoryCost: 19456,
  timeCost: 2,
  outputLen: 32,
  parallelism: 1,
};

async function seed() {
  try {
    // Connect to MongoDB
    await mongoose
      .connect(MONGO_URL, {
        dbName: "chess-helper",
      })
      .then(() => console.log("MongoDB is  connected successfully"))
      .catch((err) => console.error(err));

    // Clear existing users and sessions AND structure
    await mongoose.connection.db.dropCollection("users");
    await mongoose.connection.db.dropCollection("sessions");
    console.log("Cleared existing users and sessions");

    let firstUserId;

    // Seed users and PGNs
    for (let user_i = 1; user_i <= 5; user_i++) {
      const email = `user${user_i}@gmail.com`;
      const username = `user${user_i}`;
      const passwordHash = await hash(`pass${user_i}`, hashOptions);

      const user = await User.create({
        email,
        username,
        passwordHash
      });
      if (user_i === 1) firstUserId = user._id;

      // Create 10 PGNs per user
      for (let pgn_i = 1; pgn_i <= 10; pgn_i++) {
        await Pgn.create({
          title: `Ruy Lopez ${pgn_i} by user ${user_i}`,
          pgn: `1. e4 e5 2. Nf3 Nc6 3. Bb5 a6 4. Ba4 b5 ( 4... Nf6 5. O-O Nxe4 6. Re1 Nd6 ) 5. Bb3 Nf6 6. O-O *`,
          notes: `Notes ${pgn_i}`,
          userId: user._id
        });
      }
    }

    console.log("Database seeded successfully");
    console.log("First user ID:", firstUserId);
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

seed();
