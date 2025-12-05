import { model, Schema } from "mongoose";
import { IUser, Role, IsActive, IAuthProvider } from "./user.interface";

const authProviderSchema = new Schema<IAuthProvider>(
  {
    provider: { type: String, required: true },
    providerId: { type: String, required: true },
  },
  { _id: false, versionKey: false }
);

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    phone: { type: String },
    picture: { type: String },
    bio: { type: String },
    travelInterests: { type: [String], default: [] },
    visitedCountries: { type: [String], default: [] },
    location: { type: String },
    role: { type: String, enum: Object.values(Role), default: Role.USER },
    isActive: {
      type: String,
      enum: Object.values(IsActive),
      default: IsActive.ACTIVE,
    },
    isDeleted: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
    auths: [authProviderSchema],
  },
  { timestamps: true, versionKey: false }
);

export const User = model<IUser>("User", userSchema);
