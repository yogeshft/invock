import { Response } from "express";

import { AuthenticatedRequest } from "../middleware/auth";
import {
  CategoryService,
  categoryService,
} from "../services/CategoryService";
import { HttpError } from "../utils/HttpError";
import { StringFormatter } from "../utils/strings";

export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  listCategories = async (
    request: AuthenticatedRequest,
    response: Response,
  ) => {
    const [categories, itemCounts] = await Promise.all([
      this.categoryService.listByUser(request.userId!),
      this.categoryService.getItemCountsByCategory(request.userId!),
    ]);

    const itemCountMap = new Map(
      itemCounts.map((entry) => [String(entry._id), entry.count]),
    );

    response.json({
      categories: categories.map((category) => ({
        id: String(category._id),
        name: category.name,
        itemCount: itemCountMap.get(String(category._id)) ?? 0,
        createdAt: category.createdAt,
      })),
    });
  };

  createCategory = async (
    request: AuthenticatedRequest,
    response: Response,
  ) => {
    const { name } = request.body as { name?: string };
    const trimmedName = name?.trim().replace(/\s+/g, " ") ?? "";

    if (!trimmedName) {
      throw new HttpError(400, "Category name is required.");
    }

    if (trimmedName.length > 60) {
      throw new HttpError(400, "Category name must be 60 characters or less.");
    }

    const normalizedName = StringFormatter.normalizeCategoryName(trimmedName);

    const existingCategory = await this.categoryService.findByNormalizedName(
      request.userId!,
      normalizedName,
    );

    if (existingCategory) {
      throw new HttpError(409, "Category names must be unique.");
    }

    const category = await this.categoryService.createCategory({
      userId: request.userId!,
      name: trimmedName,
      normalizedName,
    });

    response.status(201).json({
      category: {
        id: String(category._id),
        name: category.name,
        itemCount: 0,
        createdAt: category.createdAt,
      },
    });
  };
}

export const categoryController = new CategoryController(categoryService);
