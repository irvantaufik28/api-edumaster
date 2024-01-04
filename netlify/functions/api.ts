import express from "express";
import { logger } from "../application/logging";
import serverless from "serverless-http";
import cors from "cors"
import router from "../routes/api";
import { errorMiddleware } from "../middleware/error-middleware";
import { createClient } from 'redis';

const REDIS_PORT: number = parseInt(process.env.REDIS_PORT ?? '6379', 10);
const redisClient = createClient({
  socket: {
    host: "localhost",
    port: REDIS_PORT
  }
});



(async () => {
  redisClient.on('error', (err) => {
    console.log('Redis Client Error', err);
  });
  redisClient.on('ready', () => console.log('Redis is ready'));

  await redisClient.connect();

  await redisClient.ping();
})();


const api = express();

api.use(cors({
  origin: "*",
}));

api.use(express.json());
api.use(express.urlencoded({ extended: true }));

api.use("/api/v1", router);
api.use(errorMiddleware);



const PORT = process.env.PORT || 4000;
api.listen(PORT, () => {
  logger.info(`App start at ${process.env.HOST}:${process.env.PORT}`);
});
export const handler = serverless(api);