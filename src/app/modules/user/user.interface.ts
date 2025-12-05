// src/modules/user/user.interface.ts
import { Types } from "mongoose";

export enum Role {
  SUPER_ADMIN = "SUPER_ADMIN",
  ADMIN = "ADMIN",
  USER = "USER",
}

export enum IsActive {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  BLOCKED = "BLOCKED",
}

export interface IAuthProvider {
  provider: "google" | "credentials";
  providerId: string;
}

export interface IUser {
  _id?: Types.ObjectId;
  name: string;
  email: string;
  password?: string;
  phone?: string;
  picture?: string;
  bio?: string;
  travelInterests?: string[];
  visitedCountries?: string[];
  location?: string;
  role: Role;
  isActive?: IsActive;
  isDeleted?: boolean;
  isVerified?: boolean;
  auths: IAuthProvider[];
  createdAt?: Date;
  updatedAt?: Date;
}
