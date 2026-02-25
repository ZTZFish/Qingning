// src/routes/club.routes.ts

import express from "express";
import {
  createClubApplication,
  getAuditList,
  auditClub,
  getClubList,
  uploadClubCover,
  uploadClubMaterials,
} from "../controllers/club.controller";
import { authenticateJWT, checkRole } from "../middlewares/auth.middleware";
import { createUploadMiddleware } from "../middlewares/upload.middleware";
import { Role } from "@prisma/client/index.js";

const router = express.Router();

// 1. 公共或普通用户路由
// 获取社团列表（通常只显示已通过的，或者在 controller 里区分）
router.get("/", authenticateJWT, getClubList);

// 提交社团申请
router.post("/", authenticateJWT, createClubApplication);

// 上传封面
router.post(
  "/cover",
  authenticateJWT,
  createUploadMiddleware("clubs").single("cover"),
  uploadClubCover
);

// 上传手续照片
router.post(
  "/materials",
  authenticateJWT,
  createUploadMiddleware("materials").single("materials"),
  uploadClubMaterials
);

// 2. 管理员专用路由
// 获取待审批列表
router.get("/pending", authenticateJWT, checkRole([Role.ADMIN]), getAuditList);

// 审批社团
router.put("/:id/audit", authenticateJWT, checkRole([Role.ADMIN]), auditClub);

export default router;
