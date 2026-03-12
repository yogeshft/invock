import bcrypt from "bcryptjs";
import { Request, Response } from "express";

import { DefaultCategoryCatalog } from "../constants/defaultCategories";
import { AuthenticatedRequest } from "../middleware/auth";
import { AuthService, authService } from "../services/AuthService";
import {
  CategoryService,
  categoryService,
} from "../services/CategoryService";
import { HttpError } from "../utils/HttpError";
import { jwtService, JwtService } from "../utils/jwt";
import { StringFormatter } from "../utils/strings";

export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly categoryService: CategoryService,
    private readonly tokenService: JwtService,
  ) {}

  signup = async (request: Request, response: Response) => {
    const { name, email, password } = request.body as {
      name?: string;
      email?: string;
      password?: string;
    };

    const trimmedName = name?.trim() ?? "";
    const normalizedEmail = email?.trim().toLowerCase() ?? "";
    const rawPassword = password ?? "";

    if (trimmedName.length < 2) {
      throw new HttpError(400, "Name must be at least 2 characters long.");
    }

    if (!normalizedEmail || !normalizedEmail.includes("@")) {
      throw new HttpError(400, "A valid email address is required.");
    }

    if (rawPassword.length < 6) {
      throw new HttpError(400, "Password must be at least 6 characters long.");
    }

    const existingUser = await this.authService.findUserByEmail(normalizedEmail);

    if (existingUser) {
      throw new HttpError(409, "An account with this email already exists.");
    }

    const passwordHash = await bcrypt.hash(rawPassword, 10);
    const user = await this.authService.createUser({
      name: trimmedName,
      email: normalizedEmail,
      passwordHash,
    });

    await this.seedDefaultCategories(String(user._id));

    response.status(201).json({
      token: this.tokenService.createToken(String(user._id)),
      user: this.serializeUser(user),
    });
  };

  login = async (request: Request, response: Response) => {
    const { email, password } = request.body as {
      email?: string;
      password?: string;
    };

    const normalizedEmail = email?.trim().toLowerCase() ?? "";
    const rawPassword = password ?? "";

    if (!normalizedEmail || !rawPassword) {
      throw new HttpError(400, "Email and password are required.");
    }

    const user = await this.authService.findUserByEmail(normalizedEmail);

    if (!user || !(await user.comparePassword(rawPassword))) {
      throw new HttpError(401, "Incorrect email or password.");
    }

    response.json({
      token: this.tokenService.createToken(String(user._id)),
      user: this.serializeUser(user),
    });
  };

  getCurrentUser = async (
    request: AuthenticatedRequest,
    response: Response,
  ) => {
    const user = await this.authService.findUserById(request.userId!);

    if (!user) {
      throw new HttpError(404, "User account not found.");
    }

    response.json({
      user: this.serializeUser(user),
    });
  };

  private serializeUser(user: { _id: unknown; name: string; email: string }) {
    return {
      id: String(user._id),
      name: user.name,
      email: user.email,
    };
  }

  private async seedDefaultCategories(userId: string) {
    const existingCount = await this.categoryService.countByUser(userId);

    if (existingCount > 0) {
      return;
    }

    await this.categoryService.createManyForUser(
      userId,
      DefaultCategoryCatalog.names.map((name) => ({
        name,
        normalizedName: StringFormatter.normalizeCategoryName(name),
      })),
    );
  }
}

export const authController = new AuthController(
  authService,
  categoryService,
  jwtService,
);
