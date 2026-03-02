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
  getJoinedClubs,
  transferLeader,
  getClubDetail,
  join,
  leave,
  getClubMembers,
  getApplications,
  auditApplication,
  updateClub,
  removeMember,
} from "../controllers/club.controller";
import { authenticateJWT, checkRole } from "../middlewares/auth.middleware";
import { createUploadMiddleware } from "../middlewares/upload.middleware";
import { Role } from "@prisma/client/index.js";

const router = express.Router();

// 1. 公共或普通用户路由
// 获取社团列表（通常只显示已通过的，或者在 controller 里区分）
router.get("/", authenticateJWT, getClubList);

// 获取用户管理的社团
router.get("/user/:userId/led", authenticateJWT, getLedClubs);

// 获取用户加入的社团
router.get("/user/:userId/joined", authenticateJWT, getJoinedClubs);

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

// 更新社团信息 (负责人或管理员)
router.put(
  "/:id",
  authenticateJWT,
  checkRole([Role.LEADER, Role.ADMIN]),
  updateClub
);

// 获取社团详情
router.get("/:id", authenticateJWT, getClubDetail);

// 申请加入社团
router.post("/:id/join", authenticateJWT, join);

// 退出社团
router.post("/:id/leave", authenticateJWT, leave);

// 获取社团成员
router.get("/:id/members", authenticateJWT, getClubMembers);

// 移出社团成员 (负责人或管理员)
router.delete(
  "/:id/members/:memberId",
  authenticateJWT,
  checkRole([Role.LEADER, Role.ADMIN]),
  removeMember
);

// 获取入社申请列表 (负责人)
router.get(
  "/:id/applications",
  authenticateJWT,
  checkRole([Role.LEADER]),
  getApplications
);

// 审批入社申请 (负责人)
router.put(
  "/:id/applications/:memberId",
  authenticateJWT,
  checkRole([Role.LEADER]),
  auditApplication
);

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
