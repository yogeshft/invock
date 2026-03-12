import cors from "cors";
import express, { Express } from "express";

import { errorHandler, notFoundHandler } from "./middleware/errorHandler";
import { authRoutes } from "./routes/authRoutes";
import { categoryRoutes } from "./routes/categoryRoutes";
import { healthRoutes } from "./routes/healthRoutes";
import { inventoryRoutes } from "./routes/inventoryRoutes";

const configureMiddleware = (app: Express) => {
  app.use(cors());
  app.use(express.json());
};

const configureRoutes = (app: Express) => {
  app.use("/api", healthRoutes);
  app.use("/api/auth", authRoutes);
  app.use("/api/categories", categoryRoutes);
  app.use("/api/inventory", inventoryRoutes);
};

const configureErrorHandling = (app: Express) => {
  app.use(notFoundHandler);
  app.use(errorHandler);
};

export const createApp = () => {
  const app = express();

  configureMiddleware(app);
  configureRoutes(app);
  configureErrorHandling(app);

  return app;
};

export const app = createApp();
