import { NextFunction, Request, RequestHandler, Response } from "express";

export class AsyncHandler {
  static wrap(
    handler: (
      request: Request,
      response: Response,
      next: NextFunction,
    ) => Promise<unknown>,
  ): RequestHandler {
    return (request, response, next) => {
      Promise.resolve(handler(request, response, next)).catch(next);
    };
  }
}
