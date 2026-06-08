import express from "express";
import dotenv from "dotenv";
import routes from "./routes/index.js";
import { connectRabbitMQ } from "./rabbitmq/producer.js";
import path from "path";
import { fileURLToPath } from "url";
import { connectRedis } from "./redis.js";
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
dotenv.config();

app.use(express.json());

app.use(routes);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    status: "failed",
    message: err.message,
  });
});

const startServer = async () => {
  try {
    await connectRedis();
    await connectRabbitMQ();
    app.listen(process.env.PORT, () => {
      console.log("Server berjalan");
    });
  } catch (error) {
    console.error(error);
  }
};

startServer();
