import mongoose from "mongoose";
import { IUser, User } from "../models/User.js";
import { Pgn } from "../models/Pgn.js";
import { hash } from "@node-rs/argon2";
import dotenv from "dotenv";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { IUserDocument } from "../models/User.js";
import { IPgn, IPgnDocument } from "../models/Pgn.js";

// Import environment variables
const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, "../.env") });
// dotenv.config();

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

async function connectDB() {
  if (mongoose.connection.readyState === 1) {
    // If already connected, return existing connection
    return;
  }

  try {
    await mongoose.connect(MONGO_URL as string, {
      dbName: "chess-helper",
    });
    console.log("MongoDB is connected successfully");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    throw err;
  }
}

async function deleteAllTables() {
  await connectDB();
  try {
    await User.deleteMany();
    await Pgn.deleteMany();
    console.log("All tables & structure deleted successfully");
  } catch (err) {
    console.error("Error deleting tables:", err);
  }
}

async function deleteAllTablesAndStructure() {
  await connectDB();
  try {
    await mongoose.connection.db?.dropCollection("users");
    await mongoose.connection.db?.dropCollection("sessions");
    await mongoose.connection.db?.dropCollection("pgns");
    console.log("All tables deleted successfully");
  } catch (err) {
    console.error("Error deleting tables:", err);
  }
}

async function createNewUsers(numUsers: number): Promise<IUserDocument[]> {
  await connectDB();

  const userDocuments: IUserDocument[] = [];
  for (let user_i = 1; user_i <= numUsers; user_i++) {
    const email = `user${user_i}@gmail.com`;
    const username = `user${user_i}`;
    const passwordHash = await hash(`1fe232a8433436d4206206cd4a843cbd710973ffa0c29ebd2eb1bc3c4fb10aa4c788caa02777f9fbb29873498ee0a89308c56cc02860c2e47c6d4f35adab11cf`, hashOptions);

    const user: IUser = {
      email,
      username,
      passwordHash
    }
    const userDocument: IUserDocument = await User.create(user);
    userDocuments.push(userDocument);
  }
  return userDocuments;
}

async function seedExistingUsers(users: IUserDocument[]): Promise<void> {
  await connectDB();

  for (const user of users) {
    // Create 10 PGNs per user
    for (let pgn_i = 1; pgn_i <= 10; pgn_i++) {
      const pgn: IPgn = {
        userId: user._id.toString(),
        title: `Ruy Lopez ${pgn_i} by user ${user.username}`,
        moveText: `1. e4 e5 2. Nf3 Nc6 3. Bb5 a6 4. Ba4 b5 ( 4... Nf6 5. O-O Nxe4 6. Re1 Nd6 ) 5. Bb3 Nf6 6. O-O *`,
        notes: `Notes ${pgn_i}`,
        isPublic: pgn_i == 1,
        gameProgress: {
          visitedNodeHashes: [],
        },
        gameSettings: {
          isPlayingWhite: pgn_i % 2 == 0,
          isSkipping: false,
        },
        gameMetadata: {
          fenBeforeFirstBranch: "r1bqkbnr/1ppp1ppp/p1n5/4p3/B3P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 1 4",
        },
      };
      await Pgn.create(pgn);
    }
  }
}

async function seed() {
  try {
    await connectDB();
    await deleteAllTablesAndStructure();

    // Create 5 new users
    const users = await createNewUsers(5);
    const firstUserId = users[0]._id;

    // Seed PGNs for the users
    await seedExistingUsers(users);

    console.log("Database seeded successfully");
    console.log("First user ID:", firstUserId);
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

seed();