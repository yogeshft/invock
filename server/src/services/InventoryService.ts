import { FilterQuery } from "mongoose";

import { InventoryItem, InventoryItemModel } from "../models/InventoryItem";

export class InventoryService {
  async listInventory(
    query: FilterQuery<InventoryItem>,
    page: number,
    limit: number,
  ) {
    return InventoryItemModel.find(query)
      .populate("categoryId", "name")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();
  }

  async countInventory(query: FilterQuery<InventoryItem>) {
    return InventoryItemModel.countDocuments(query);
  }

  async createInventoryItem(payload: {
    userId: string;
    categoryId: unknown;
    name: string;
    description: string;
    price: number;
  }) {
    return InventoryItemModel.create(payload);
  }

  async findInventoryItemById(itemId: string) {
    return InventoryItemModel.findById(itemId)
      .populate("categoryId", "name")
      .lean();
  }
}

export const inventoryService = new InventoryService();
