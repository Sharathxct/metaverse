import { json, urlencoded } from "body-parser";
import express, { type Express, type NextFunction, type Request } from "express";
import morgan from "morgan";
import cors from "cors";
import router from "./router";
import { exceptionaHandler } from "./middlewares/globalError";
import * as dotenv from 'dotenv';

dotenv.config();

export const createServer = (): Express => {
  const app = express();
  app
    .disable("x-powered-by")
    .use(morgan("dev"))
    .use(urlencoded({ extended: true }))
    .use(json())
    .use(cors())
    .use('/api/v1', router)
    .get("/status", (_, res) => {
      return res.json({ ok: true });
    });

  app.use(exceptionaHandler)

  return app;
};
