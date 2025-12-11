// src/modules/user/user.service.ts
import bcrypt from "bcryptjs";
import { JwtPayload } from "jsonwebtoken";
import { IUser, Role, IAuthProvider } from "./user.interface";
import { User } from "./user.model";
import { envVars } from "../../config/env";
import { userSearchableFields } from "./user.constant";
import AppError from "../../errorHelpers/AppErrors";
import { QueryBuilder } from "../../utils/queryBuilder";
import { deleteImageFromCLoudinary, uploadBufferToCloudinary } from "../../config/cloudinary.config";

const createUser = async (payload: Partial<IUser>) => {
  const { email, password, ...rest } = payload;

  const exist = await User.findOne({ email });
  if (exist) throw new AppError(400, "User already exists");

  const hashedPassword = await bcrypt.hash(
    password as string,
    Number(envVars.BCRYPT_SALT_ROUND)
  );
  const authProvider: IAuthProvider = {
    provider: "credentials",
    providerId: email as string,
  };

  const user = await User.create({
    email,
    password: hashedPassword,
    auths: [authProvider],
    ...rest,
  });
  console.log(user);
  return user;
};

const updateUser = async (
  userId: string,
  payload: Partial<IUser>,
  decodedToken: JwtPayload
) => {
  const user = await User.findById(userId);
  if (!user) throw new AppError(404, "User not found");

  if (decodedToken.role === Role.USER && decodedToken.userId !== userId) {
    throw new AppError(403, "You are not authorized");
  }

  if (payload.password) {
    payload.password = await bcrypt.hash(
      payload.password,
      Number(envVars.BCRYPT_SALT_ROUND)
    );
  }

  const updated = await User.findByIdAndUpdate(userId, payload, {
    new: true,
    runValidators: true,
  });

  return updated;
};

export const updateMyProfile = async (
  userId: string,
  payload: any,
  decodedToken: JwtPayload,
  file?: Express.Multer.File
) => {
  const user = await User.findById(userId);
  if (!user) throw new AppError(404, "User not found");

  if (decodedToken.role === "USER" && decodedToken.userId !== userId) {
    throw new AppError(403, "You are not authorized");
  }

  if (payload.password) {
    payload.password = await bcrypt.hash(
      payload.password,
      Number(envVars.BCRYPT_SALT_ROUND)
    );
  }

  if (file) {
    if (user.picture) {
      await deleteImageFromCLoudinary(user.picture);
    }

    const uploadResult = await uploadBufferToCloudinary(file.buffer, `profile-${userId}`);
    payload.picture = uploadResult?.secure_url;
  }

  const updated = await User.findByIdAndUpdate(userId, payload, {
    new: true,
    runValidators: true,
  });

  return updated;
};

const upgradeToPremium = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user) throw new AppError(404, "User not found");

  user.role = Role.PREMIUM;
  await user.save();

  return user;
};

const deleteUser = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user) throw new AppError(404, "User not found");

  user.isDeleted = true;
  await user.save();

  return user;
};

const getAllUsers = async (query: Record<string, string>) => {
  const queryBuilder = new QueryBuilder(User.find({ isDeleted: false }), query)
    .filter()
    .search(userSearchableFields)
    .sort()
    .fields()
    .paginate();

  const [data, meta] = await Promise.all([
    queryBuilder.build(),
    queryBuilder.getMeta(),
  ]);

  return { data, meta };
};

const getSingleUser = async (userId: string) => {
  const user = await User.findOne({ _id: userId, isDeleted: false }).select(
    "-password"
  );
  if (!user) {
    throw new AppError(404, "No user found with this id.");
  }
  return { data: user };
};

const getMe = async (userId: string) => {
  const user = await User.findById(userId).select("-password");
  return { data: user };
};

export const UserServices = {
  createUser,
  updateUser,
  updateMyProfile,
  upgradeToPremium,
  getAllUsers,
  getSingleUser,
  getMe,
  deleteUser,
};
