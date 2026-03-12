import { NextFunction, Request, Response } from "express";

import { HttpError } from "../utils/HttpError";
import { jwtService } from "../utils/jwt";

export interface AuthenticatedRequest extends Request {
  userId?: string;
}

export const requireAuth = (
  request: AuthenticatedRequest,
  _response: Response,
  next: NextFunction,
) => {
  const authorization = request.headers.authorization;

  if (!authorization?.startsWith("Bearer ")) {
    next(new HttpError(401, "Authentication required."));
    return;
  }

  try {
    const token = authorization.replace("Bearer ", "");
    const payload = jwtService.verifyToken(token);
    request.userId = payload.userId;
    next();
  } catch {
    next(new HttpError(401, "Your session is invalid or has expired."));
  }
};
