// src/routes/club.routes.ts

import express from "express";
import {
  createClubApplication,
  getAuditList,
  auditClub,
  getClubList,
  uploadClubCover,
  uploadClubMaterials,
  getLedClubs,
  transferLeader,
} from "../controllers/club.controller";
import { authenticateJWT, checkRole } from "../middlewares/auth.middleware";
import { createUploadMiddleware } from "../middlewares/upload.middleware";
import { Role } from "@prisma/client/index.js";

const router = express.Router();

// 1. 公共或普通用户路由
// 获取社团列表（通常只显示已通过的，或者在 controller 里区分）
router.get("/", authenticateJWT, getClubList);

// 获取用户管理的社团
router.get("/user/:userId", authenticateJWT, getLedClubs);

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

// 转让社团负责人
router.put(
  "/:clubId/transfer",
  authenticateJWT,
  checkRole([Role.ADMIN]),
  transferLeader
);

export default router;
