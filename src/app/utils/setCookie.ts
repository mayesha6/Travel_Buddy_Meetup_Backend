// import { Response } from "express";
// import { envVars } from "../config/env";

// export interface AuthTokens {
//     accessToken?: string;
//     refreshToken?: string;
// }

// export const setAuthCookie = (res: Response, tokenInfo: AuthTokens) => {
//     if (tokenInfo.accessToken) {
//         res.cookie("accessToken", tokenInfo.accessToken, {
//             httpOnly: true,
//             secure: envVars.NODE_ENV === "production",
//             sameSite: "none"
//         })
//     }

//     if (tokenInfo.refreshToken) {
//         res.cookie("refreshToken", tokenInfo.refreshToken, {
//             httpOnly: true,
//             secure: envVars.NODE_ENV === "production",
//             sameSite: "none"
//         })
//     }
// }

// utils/setCookie.ts
import { Response } from "express";

const isProd = process.env.NODE_ENV === "production";

export const setAuthCookie = (res: Response, tokenInfo: { accessToken: string; refreshToken?: string } | any) => {
  // choose secure only in production
  const cookieOptions = {
    httpOnly: true,
    secure: isProd,          // true in production (https), false in dev (http)
    sameSite: "lax" as "lax", // safe default for cross-site GET navigation and form post
    path: "/",
    // domain: "localhost" // usually unnecessary for common dev local setups
  };

  // set access token
  if (tokenInfo.accessToken) {
    res.cookie("accessToken", tokenInfo.accessToken, {
      ...cookieOptions,
      maxAge: 1000 * 60 * 60 * 24, // e.g. 1 day or use your token expiry
    });
  }

  // set refresh token (if present)
  if (tokenInfo.refreshToken) {
    res.cookie("refreshToken", tokenInfo.refreshToken, {
      ...cookieOptions,
      maxAge: 1000 * 60 * 60 * 24 * 90, // e.g. 90 days
    });
  }
};

