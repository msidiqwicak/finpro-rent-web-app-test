import { Router } from "express";
import { uploadUserAvatar } from "../controllers/user.controller.js";
import { uploadAvatar } from "../middlewares/upload.middleware.js";
import { authenticate, authorizeRole } from "../middlewares/auth.middleware.js";

const router = Router();

// PATCH /api/users/avatar
// Alur: authenticate → authorizeRole('USER','TENANT') → uploadAvatar → controller
// Baik USER maupun TENANT boleh mengganti foto profil mereka
router.patch(
  "/avatar",
  authenticate,
  authorizeRole("USER", "TENANT"),
  uploadAvatar.single("image"),
  uploadUserAvatar,
);

export default router;
