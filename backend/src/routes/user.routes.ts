// src/routes/user.routes.ts

import express from "express";
import {
  register,
  getProfile,
  updateProfile,
  updateEmail,
  uploadAvatar,
} from "../controllers/user.controller";
import { authenticateJWT } from "../middlewares/auth.middleware";
import { createUploadMiddleware } from "../middlewares/upload.middleware";

const router = express.Router();

// POST /api/users - 注册（创建用户资源）
router.post("/", register);

// GET /api/users/me - 获取当前用户资料
router.get("/me", authenticateJWT, getProfile);

// PUT /api/users/me - 更新当前用户资料（用户名、头像）
router.put("/me", authenticateJWT, updateProfile);

// POST /api/users/me/avatar - 上传头像
router.post(
  "/me/avatar",
  authenticateJWT,
  createUploadMiddleware("avatars").single("avatar"),
  uploadAvatar
);

// PUT /api/users/me/email - 更新当前用户邮箱
router.put("/me/email", authenticateJWT, updateEmail);

export default router;
