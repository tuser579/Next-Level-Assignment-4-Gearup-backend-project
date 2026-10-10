import { Router } from "express";
import { authController } from "./auth.controller";
import { auth } from "../../middlewares/auth";

const router = Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/me", auth(), authController.getMe);
router.post("/refresh-token", authController.refreshToken);
router.patch("/profile", auth(), authController.updateProfile);
router.post("/change-password", auth(), authController.changePassword);

export const authRoutes = router;