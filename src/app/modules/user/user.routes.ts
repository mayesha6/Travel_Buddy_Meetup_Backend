import { Router } from "express";
import { UserControllers } from "./user.contorller";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "./user.interface";
import { validateRequest } from "../../middleware/validateRequest";
import { updateUserZodSchema } from "./user.validation";

const router = Router();

router.post("/register", UserControllers.createUser);
router.get(
  "/all-users",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  UserControllers.getAllUsers
);
router.get("/me", checkAuth(...Object.values(Role)), UserControllers.getMe);
router.get(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  UserControllers.getSingleUser
);
router.patch(
  "/:id",
  validateRequest(updateUserZodSchema),
  checkAuth(...Object.values(Role)),
  UserControllers.updateUser
);
router.delete(
  "/:id",
  checkAuth(...Object.values(Role)),
  UserControllers.deleteUser
);

export const UserRoutes = router;
