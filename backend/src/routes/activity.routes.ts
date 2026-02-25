// src/routes/activity.routes.ts

import express from "express";
import {
  createActivityApplication,
  uploadActivityCover,
  getAuditList,
  auditActivity,
  getActivityList,
} from "../controllers/activity.controller";
import { authenticateJWT, checkRole } from "../middlewares/auth.middleware";
import { createUploadMiddleware } from "../middlewares/upload.middleware";
import { Role } from "@prisma/client/index.js";

const router = express.Router();

router.get("/", authenticateJWT, getActivityList);
router.post("/", authenticateJWT, createActivityApplication);
router.post(
  "/cover",
  authenticateJWT,
  createUploadMiddleware("activities").single("cover"),
  uploadActivityCover
);

// 管理员
router.get(
  "/pending",
  authenticateJWT,
  checkRole([Role.ADMIN]),
  getAuditList
);
router.put(
  "/:id/audit",
  authenticateJWT,
  checkRole([Role.ADMIN]),
  auditActivity
);

export default router;
