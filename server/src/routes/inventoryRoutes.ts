import { Router } from "express";

import { inventoryController } from "../controllers/InventoryController";
import { requireAuth } from "../middleware/auth";
import { AsyncHandler } from "../utils/asyncHandler";

export const inventoryRoutes = Router();

inventoryRoutes.use(requireAuth);
inventoryRoutes.get("/", AsyncHandler.wrap(inventoryController.listInventory));
inventoryRoutes.post("/", AsyncHandler.wrap(inventoryController.createInventoryItem));
