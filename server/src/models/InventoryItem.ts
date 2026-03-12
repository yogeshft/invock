import { InferSchemaType, Schema, Types, model } from "mongoose";

const inventoryItemSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 500,
      default: "",
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    timestamps: true,
  },
);

inventoryItemSchema.index({ userId: 1, createdAt: -1 });

export type InventoryItem = InferSchemaType<typeof inventoryItemSchema> & {
  _id: Types.ObjectId;
};

export const InventoryItemModel = model("InventoryItem", inventoryItemSchema);
