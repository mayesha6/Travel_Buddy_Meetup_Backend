import { Router } from "express";
import { UserControllers } from "./user.contorller";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "./user.interface";
import { validateRequest } from "../../middleware/validateRequest";
import { updateUserZodSchema } from "./user.validation";
import multer from "multer";
import { multerUpload } from "../../config/multer.config";
import { parseFormDataMiddleware } from "../../middleware/parseFormData";

const router = Router();
const upload = multer();

router.post("/register", UserControllers.createUser);
router.get(
  "/all-users",
  // checkAuth(Role.PREMIUM, Role.USER, Role.ADMIN, Role.SUPER_ADMIN),
  UserControllers.getAllUsers
);
router.get("/me", checkAuth(...Object.values(Role)), UserControllers.getMe);
router.get(
  "/:id",
  // checkAuth(Role.PREMIUM, Role.USER, Role.ADMIN, Role.SUPER_ADMIN),
  UserControllers.getSingleUser
);


router.patch(
  "/update-my-profile",
  checkAuth(Role.PREMIUM, Role.USER, Role.ADMIN, Role.SUPER_ADMIN),
  multerUpload.single("file"),          // handle file upload
  parseFormDataMiddleware,              // moved middleware here
  validateRequest(updateUserZodSchema), // Zod validation
  UserControllers.updateMyProfile
);

router.patch(
  "/upgrade-to-premium/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN), // only admins can upgrade manually
  UserControllers.upgradeToPremium
);

router.patch(
  "/:id",
  checkAuth(...Object.values(Role)),
  validateRequest(updateUserZodSchema),
  UserControllers.updateUser
);
router.delete(
  "/:id",
  checkAuth(...Object.values(Role)),
  UserControllers.deleteUser
);


export const UserRoutes = router;
