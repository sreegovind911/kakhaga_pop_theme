import express, { type Express } from "express";
import cors from "cors";
import { pinoHttp } from "pino-http";
import type { IncomingMessage, ServerResponse } from "http";
import router from "./routes";
import { logger } from "./lib/logger";

const app: Express = express();

// Handle ESM/CJS default export interop for pino-http across different bundlers/environments (e.g. Vercel)
const pinoMiddleware = typeof pinoHttp === "function" ? pinoHttp : (pinoHttp as any)?.default || pinoHttp;

app.use(
  (pinoMiddleware as typeof pinoHttp)({
    logger,
    serializers: {
      req(req: IncomingMessage & { id?: unknown }) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res: ServerResponse) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);

export default app;
