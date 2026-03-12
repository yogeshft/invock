import { NextFunction, Request, Response } from "express";

import { HttpError } from "../utils/HttpError";

export const notFoundHandler = (
  _request: Request,
  _response: Response,
  next: NextFunction,
) => {
  next(new HttpError(404, "Route not found."));
};

export const errorHandler = (
  error: Error & { code?: number; statusCode?: number },
  _request: Request,
  response: Response,
  _next: NextFunction,
) => {
  if (error.code === 11000) {
    response.status(409).json({
      message: "This resource already exists.",
    });
    return;
  }

  const statusCode =
    error instanceof HttpError
      ? error.statusCode
      : error.statusCode && error.statusCode >= 400
        ? error.statusCode
        : 500;

  response.status(statusCode).json({
    message:
      statusCode === 500
        ? "An unexpected server error occurred."
        : error.message,
  });
};
