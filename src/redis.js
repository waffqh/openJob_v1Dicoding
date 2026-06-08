import dotenv from "dotenv";
import { createClient } from "redis";
dotenv.config();

const client = createClient({
  url: process.env.REDIS_HOST || "redis://localhost:6379",
});

client.on("error", (err) => console.error("Redis error:", err));
client.on("connect", () => console.log("Redis connected"));

const connectRedis = async () => {
  await client.connect();
};

export { client, connectRedis };
