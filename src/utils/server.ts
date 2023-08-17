import express from "express";
import routes from "../routes";
import deserializeUser from "../middleware/deserializeUser";
import {speedLimiter, limiter} from "../middleware/limit"

function createServer() {
  const app = express();

  app.use(express.json());

  app.use(deserializeUser);

  app.use(speedLimiter)
  app.use(limiter)
  routes(app);

  return app;
}

export default createServer;
