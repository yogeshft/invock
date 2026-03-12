import { FilterQuery, Types } from "mongoose";
import { Response } from "express";

import { AuthenticatedRequest } from "../middleware/auth";
import { CategoryService, categoryService } from "../services/CategoryService";
import {
  InventoryService,
  inventoryService,
} from "../services/InventoryService";
import { InventoryItem } from "../models/InventoryItem";
import { HttpError } from "../utils/HttpError";
import { StringFormatter } from "../utils/strings";

type InventoryItemWithCategory = InventoryItem & {
  categoryId?: { _id: Types.ObjectId; name: string } | Types.ObjectId;
};

export class InventoryController {
  constructor(
    private readonly inventoryService: InventoryService,
    private readonly categoryService: CategoryService,
  ) {}

  listInventory = async (
    request: AuthenticatedRequest,
    response: Response,
  ) => {
    const page = Math.max(Number(request.query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(request.query.limit) || 6, 1), 24);
    const search = String(request.query.search ?? "").trim();
    const categoryId = String(request.query.categoryId ?? "").trim();

    const query: FilterQuery<InventoryItem> = {
      userId: request.userId!,
    };

    if (categoryId && categoryId !== "all") {
      if (!Types.ObjectId.isValid(categoryId)) {
        throw new HttpError(400, "Invalid category filter.");
      }

      query.categoryId = new Types.ObjectId(categoryId);
    }

    if (search) {
      const pattern = new RegExp(StringFormatter.escapeRegExp(search), "i");
      query.$or = [{ name: pattern }, { description: pattern }];
    }

    const [items, totalItems] = await Promise.all([
      this.inventoryService.listInventory(query, page, limit),
      this.inventoryService.countInventory(query),
    ]);

    response.json({
      items: items.map((item) =>
        this.serializeInventoryItem(item as InventoryItemWithCategory),
      ),
      pagination: {
        page,
        limit,
        totalItems,
        totalPages: Math.max(Math.ceil(totalItems / limit), 1),
      },
    });
  };

  createInventoryItem = async (
    request: AuthenticatedRequest,
    response: Response,
  ) => {
    const { name, description, price, categoryId } = request.body as {
      name?: string;
      description?: string;
      price?: number | string;
      categoryId?: string;
    };

    const trimmedName = name?.trim().replace(/\s+/g, " ") ?? "";
    const trimmedDescription = description?.trim() ?? "";
    const parsedPrice = typeof price === "string" ? Number(price) : price;

    if (!trimmedName) {
      throw new HttpError(400, "Item name is required.");
    }

    if (!categoryId || !Types.ObjectId.isValid(categoryId)) {
      throw new HttpError(400, "A valid category is required.");
    }

    if (!Number.isFinite(parsedPrice) || Number(parsedPrice) < 0) {
      throw new HttpError(400, "Price must be a positive number.");
    }

    const category = await this.categoryService.findByIdForUser(
      request.userId!,
      categoryId,
    );

    if (!category) {
      throw new HttpError(404, "Selected category was not found.");
    }

    const item = await this.inventoryService.createInventoryItem({
      userId: request.userId!,
      categoryId: category._id,
      name: trimmedName,
      description: trimmedDescription,
      price: Number(parsedPrice),
    });

    const hydratedItem = await this.inventoryService.findInventoryItemById(
      String(item._id),
    );

    if (!hydratedItem) {
      throw new HttpError(500, "Failed to load created item.");
    }

    response.status(201).json({
      item: this.serializeInventoryItem(hydratedItem as InventoryItemWithCategory),
    });
  };

  private serializeInventoryItem(item: InventoryItemWithCategory) {
    return {
      id: String(item._id),
      name: item.name,
      description: item.description,
      price: item.price,
      createdAt: item.createdAt,
      category:
        item.categoryId &&
        typeof item.categoryId === "object" &&
        "name" in item.categoryId
          ? {
              id: String(item.categoryId._id),
              name: item.categoryId.name,
            }
          : null,
    };
  }
}

export const inventoryController = new InventoryController(
  inventoryService,
  categoryService,
);
