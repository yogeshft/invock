import { Types } from "mongoose";

import { CategoryModel } from "../models/Category";
import { InventoryItemModel } from "../models/InventoryItem";

export class CategoryService {
  async countByUser(userId: string) {
    return CategoryModel.countDocuments({ userId });
  }

  async createManyForUser(
    userId: string,
    categories: Array<{ name: string; normalizedName: string }>,
  ) {
    return CategoryModel.insertMany(
      categories.map((category) => ({
        userId,
        name: category.name,
        normalizedName: category.normalizedName,
      })),
    );
  }

  async listByUser(userId: string) {
    return CategoryModel.find({ userId }).sort({ name: 1 }).lean();
  }

  async getItemCountsByCategory(userId: string) {
    return InventoryItemModel.aggregate<{ _id: Types.ObjectId; count: number }>([
      {
        $match: {
          userId: new Types.ObjectId(userId),
        },
      },
      {
        $group: {
          _id: "$categoryId",
          count: { $sum: 1 },
        },
      },
    ]);
  }

  async findByNormalizedName(userId: string, normalizedName: string) {
    return CategoryModel.findOne({
      userId,
      normalizedName,
    });
  }

  async findByIdForUser(userId: string, categoryId: string) {
    return CategoryModel.findOne({
      _id: categoryId,
      userId,
    });
  }

  async createCategory(payload: {
    userId: string;
    name: string;
    normalizedName: string;
  }) {
    return CategoryModel.create(payload);
  }
}

export const categoryService = new CategoryService();
