import express, { type Express, type RequestHandler } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import type { IncomingMessage, ServerResponse } from "http";
import router from "./routes";
import { logger } from "./lib/logger";

const app: Express = express();

// Explicitly assert pinoHttp signature for TypeScript strict mode across CJS/ESM interop environments (Vercel builds)
const createPinoMiddleware = pinoHttp as unknown as (options: Record<string, unknown>) => RequestHandler;

app.use(
  createPinoMiddleware({
    logger,
    serializers: {
      req: (req: IncomingMessage & { id?: unknown }) => ({
        id: req.id,
        method: req.method,
        url: req.url?.split("?")[0],
      }),
      res: (res: ServerResponse) => ({
        statusCode: res.statusCode,
      }),
    },
  }),
);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);

export default app;
