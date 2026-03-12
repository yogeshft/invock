import jwt from "jsonwebtoken";

import { config } from "../config";

export interface JwtPayload {
  userId: string;
}

export class JwtService {
  constructor(private readonly secret: string) {}

  createToken(userId: string) {
    return jwt.sign({ userId }, this.secret, {
      expiresIn: "7d",
    });
  }

  verifyToken(token: string) {
    return jwt.verify(token, this.secret) as JwtPayload;
  }
}

export const jwtService = new JwtService(config.jwtSecret);
