import express, { Router } from "express";
import serverless from "serverless-http";

const api = express();

const router = Router();
router.get("/hello", (req, res) => res.send("Hello World!"));

api.use("/api/", router);
const PORT = process.env.PORT || 4000;
api.listen(PORT, () => {
    console.log(`App start at ${process.env.HOST}:${process.env.PORT}`);
  });
export const handler = serverless(api);