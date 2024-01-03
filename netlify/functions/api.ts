import express, { Router } from "express";
import { logger } from "../application/logging";
import serverless from "serverless-http";
import cors from "cors"
import { prismaClient } from "../application/database";
import  router  from "../routes/api";
import { errorMiddleware } from "../middleware/error-middleware";

const api = express();
api.use(express.json());

api.use(cors({
    origin: "*",
  }));
  


api.use("/api/v1", router);
api.use(errorMiddleware);



const PORT = process.env.PORT || 4000;
api.listen(PORT, () => {
    logger.info(`App start at ${process.env.HOST}:${process.env.PORT}`);
  });
export const handler = serverless(api);