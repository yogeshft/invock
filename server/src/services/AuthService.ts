import { UserModel } from "../models/User";

export class AuthService {
  async findUserByEmail(email: string) {
    return UserModel.findOne({ email });
  }

  async findUserById(userId: string) {
    return UserModel.findById(userId);
  }

  async createUser(payload: {
    name: string;
    email: string;
    passwordHash: string;
  }) {
    return UserModel.create(payload);
  }
}

export const authService = new AuthService();
