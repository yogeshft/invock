import { Router } from "express";

import { categoryController } from "../controllers/CategoryController";
import { requireAuth } from "../middleware/auth";
import { AsyncHandler } from "../utils/asyncHandler";

export const categoryRoutes = Router();

categoryRoutes.use(requireAuth);
categoryRoutes.get("/", AsyncHandler.wrap(categoryController.listCategories));
categoryRoutes.post("/", AsyncHandler.wrap(categoryController.createCategory));
