// src/routes/auth.routes.ts

import express from "express";
import {
  login,
  sendVerificationCode,
  resetPassword,
} from "../controllers/user.controller";

const router = express.Router();

// POST /api/auth/code - 发送验证码
router.post("/code", sendVerificationCode);

// POST /api/auth/login - 登录
router.post("/login", login);

// POST /api/auth/reset-password - 重置密码
router.post("/reset-password", resetPassword);

export default router;
