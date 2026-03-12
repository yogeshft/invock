import dotenv from "dotenv";

dotenv.config();

const toNumber = (value: string | undefined, fallback: number) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

export const createConfig = () => ({
  port: toNumber(process.env.PORT, 4000),
  mongoUri:
    process.env.MONGODB_URI ??
    "mongodb://127.0.0.1:27017/inventory-management",
  jwtSecret: process.env.JWT_SECRET ?? "change-this-secret",
});

export const config = createConfig();
