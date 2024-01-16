import express from "express";
import { logger } from "./application/logging";
import cors from "cors";
import router from "./routes/api";
import { errorMiddleware } from "./middleware/error-middleware";
import { createClient } from "redis";
import { PrismaClient } from "@prisma/client";

const REDIS_PORT: number = parseInt(process.env.REDIS_PORT ?? "6379", 10);
const REDIS_HOST: string = process.env.REDIS_HOST ?? "0.0.0.0";
const REDIS_PASSWORD: string = process.env.REDIS_PASSWORD ?? "defaultpass";
const redisClient = createClient({
  socket: {
    host: REDIS_HOST,
    port: REDIS_PORT,
  },
  // password: REDIS_PASSWORD,
});

(async () => {
  redisClient.on("error", (err) => {
    console.log("Redis Client Error", err);
  });
  redisClient.on("ready", () => console.log("Redis is ready"));

  await redisClient.connect();

  await redisClient.ping();
})();

const prisma = new PrismaClient();
(async () => {
  try {
    await prisma.$connect();
    console.log('Prisma connected successfully!');
  } catch (error) {
    console.error('Prisma connection error:', error);
  } finally {
    await prisma.$disconnect();
  }
})();

const api = express();

api.use(
  cors({
    origin: "*",
  })
);

api.use(express.json());
api.use(express.urlencoded({ extended: true }));

api.use("/api/v1", router);
api.use(errorMiddleware);

const PORT = process.env.PORT || 4000;
api.listen(PORT, () => {
  logger.info(`App start at ${process.env.HOST}:${process.env.PORT}`);
});
