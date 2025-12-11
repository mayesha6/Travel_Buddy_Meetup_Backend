import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { UserServices } from "./user.service";
import AppError from "../../errorHelpers/AppErrors";
import { Role } from "./user.interface";

const createUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await UserServices.createUser(req.body);
    console.log(user);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "User Created Successfully",
      data: user,
    });
  }
);

const updateUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id;
    const decodedToken = req.user as JwtPayload;
    const updated = await UserServices.updateUser(
      userId,
      req.body,
      decodedToken
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "User Updated Successfully",
      data: updated,
    });
  }
);

// export const updateMyProfile = catchAsync(
//   async (req: Request, res: Response, next: NextFunction) => {
//     const decodedToken = req.user as JwtPayload;
//     const userId = decodedToken.userId;

//     const payload: any = { ...req.body };

//     if (payload.travelInterests) {
//       payload.travelInterests = payload.travelInterests
//         .split(",")
//         .map((v: string) => v.trim());
//     }

//     if (payload.visitedCountries) {
//       payload.visitedCountries = payload.visitedCountries
//         .split(",")
//         .map((v: string) => v.trim());
//     }

//     const updatedUser = await UserServices.updateMyProfile(
//       userId,
//       payload,
//       decodedToken,
//       req.file 
//     );

//     sendResponse(res, {
//       success: true,
//       statusCode: httpStatus.OK,
//       message: "Profile updated successfully.",
//       data: updatedUser,
//     });
//   }
// );

export const updateMyProfile = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user as JwtPayload;
    const userId = decodedToken.userId;

    const payload: any = { ...req.body };

    // Ensure travelInterests is always an array
    if (payload.travelInterests) {
      if (typeof payload.travelInterests === "string") {
        payload.travelInterests = payload.travelInterests
          .split(",")
          .map((v: string) => v.trim())
          .filter((x: string) => x);
      } else if (!Array.isArray(payload.travelInterests)) {
        payload.travelInterests = [];
      }
    }

    // Ensure visitedCountries is always an array
    if (payload.visitedCountries) {
      if (typeof payload.visitedCountries === "string") {
        payload.visitedCountries = payload.visitedCountries
          .split(",")
          .map((v: string) => v.trim())
          .filter((x: string) => x);
      } else if (!Array.isArray(payload.visitedCountries)) {
        payload.visitedCountries = [];
      }
    }

    // Call service
    const updatedUser = await UserServices.updateMyProfile(
      userId,
      payload,
      decodedToken,
      req.file // optional profile picture
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Profile updated successfully.",
      data: updatedUser,
    });
  }
);

const upgradeToPremium = catchAsync(async (req: Request, res: Response) => {
  const userId = req.params.id;

  const upgradedUser = await UserServices.upgradeToPremium(userId);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "User upgraded to premium successfully",
    data: upgradedUser,
  });
});

const getAllUsers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await UserServices.getAllUsers(
      req.query as Record<string, string>
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "All Users Retrieved Successfully.",
      data: result.data,
      meta: result.meta,
    });
  }
);

const getSingleUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await UserServices.getSingleUser(req.params.id);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "User Retrieved Successfully.",
      data: result.data,
    });
  }
);

const getMe = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user as JwtPayload;
    const result = await UserServices.getMe(decodedToken.userId);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Your profile Retrieved Successfully.",
      data: result.data,
    });
  }
);
const deleteUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id;
    const decodedToken = req.user as JwtPayload;

    if (decodedToken.role === Role.USER && decodedToken.userId !== userId) {
      throw new AppError(403, "You are not authorized to delete this user.");
    }

    const deletedUser = await UserServices.deleteUser(userId);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "User soft-deleted successfully.",
      data: deletedUser,
    });
  }
);

export const UserControllers = {
  createUser,
  updateUser,
  updateMyProfile,
  upgradeToPremium,
  getAllUsers,
  getSingleUser,
  getMe,
  deleteUser,
};
