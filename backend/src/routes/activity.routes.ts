// src/routes/activity.routes.ts

import express from "express";
import {
  createActivityApplication,
  createActivityDraft,
  submitActivity,
  uploadActivityCover,
  getAuditList,
  auditActivity,
  getActivities,
  cancelActivityController,
  deleteActivityController,
  getActivityDetailController,
  updateActivityDraftController,
  enrollActivityController,
  getEnrollmentListController,
  auditEnrollmentController,
} from "../controllers/activity.controller";
import { authenticateJWT, checkRole } from "../middlewares/auth.middleware";
import { createUploadMiddleware } from "../middlewares/upload.middleware";
import { Role } from "@prisma/client/index.js";

const router = express.Router();

router.get("/", authenticateJWT, getActivities);
router.post("/", authenticateJWT, createActivityApplication);
router.post(
  "/draft",
  authenticateJWT,
  checkRole([Role.LEADER]),
  createActivityDraft
);
router.put(
  "/:id/submit",
  authenticateJWT,
  checkRole([Role.LEADER]),
  submitActivity
);
router.post(
  "/cover",
  authenticateJWT,
  createUploadMiddleware("activities").single("cover"),
  uploadActivityCover
);

// 管理员
router.get("/pending", authenticateJWT, checkRole([Role.ADMIN]), getAuditList);
router.put(
  "/:id/audit",
  authenticateJWT,
  checkRole([Role.ADMIN]),
  auditActivity
);

// 负责人取消活动
router.put(
  "/:id/cancel",
  authenticateJWT,
  checkRole([Role.LEADER]),
  cancelActivityController
);
// 获取活动详情
router.get("/:id", authenticateJWT, getActivityDetailController);
// 负责人保存草稿编辑
router.put(
  "/:id",
  authenticateJWT,
  checkRole([Role.LEADER]),
  updateActivityDraftController
);

// 用户报名活动
router.post("/:id/enroll", authenticateJWT, enrollActivityController);

// 获取活动已录取名单（公开）
router.get(
  "/:id/admitted",
  authenticateJWT,
  (req, res, next) => {
    // 强制设置 query 参数，确保 controller 能读到
    req.query.public = 'true';
    req.query.status = 'APPROVED'; // 显式设置 status 为 APPROVED
    next();
  },
  getEnrollmentListController
);

// 负责人获取报名名单
router.get(
  "/:id/enrollments",
  authenticateJWT,
  checkRole([Role.LEADER]),
  getEnrollmentListController
);

// 负责人审核报名
router.put(
  "/:id/enrollments/:userId",
  authenticateJWT,
  checkRole([Role.LEADER]),
  auditEnrollmentController
);

// 管理员删除活动
router.delete(
  "/:id",
  authenticateJWT,
  checkRole([Role.ADMIN]),
  deleteActivityController
);

export default router;
