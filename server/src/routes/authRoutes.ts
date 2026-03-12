import { Router } from "express";

import { authController } from "../controllers/AuthController";
import { requireAuth } from "../middleware/auth";
import { AsyncHandler } from "../utils/asyncHandler";

export const authRoutes = Router();

authRoutes.post("/signup", AsyncHandler.wrap(authController.signup));
authRoutes.post("/login", AsyncHandler.wrap(authController.login));
authRoutes.get("/me", requireAuth, AsyncHandler.wrap(authController.getCurrentUser));
