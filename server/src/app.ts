import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./config/env.js";

const app = express();

app.use(cors({ origin: env.clientUrl, credentials: true }));
app.use(helmet());
app.use(morgan(env.nodeEnv === "production" ? "combined" : "dev"));
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    app: "LibrarySphere",
    environment: env.nodeEnv,
    timestamp: new Date().toISOString(),
  });
});

app.get("/api", (_req, res) => {
  res.status(200).json({
    service: "LibrarySphere API",
    phase: "Project Setup",
    message: "The server is running and ready for database and auth setup.",
  });
});

export default app;
