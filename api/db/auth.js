import { Lucia, TimeSpan } from "lucia";
import { MongodbAdapter } from "@lucia-auth/adapter-mongodb";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.MONGO_URL) throw new Error("MONGO_URL is not defined");

// Create an async function to initialize the connection
export async function initializeLucia() {
  const client = new MongoClient(process.env.MONGO_URL);
  await client.connect();
  const db = client.db("chess-helper");

  const adapter = new MongodbAdapter(
    db.collection("sessions"),
    db.collection("users")
  );

  return new Lucia(adapter, {
    sessionCookie: {
      attributes: {
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      },
    },
    sessionExpiresIn: new TimeSpan(60, "m"),
  });
}
