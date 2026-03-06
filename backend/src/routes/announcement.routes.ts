
import express from "express";
import {
  create,
  update,
  remove,
  getList,
  getDetail,
} from "../controllers/announcement.controller";
import { authenticateJWT, checkRole } from "../middlewares/auth.middleware";
import { Role } from "@prisma/client/index.js";

const router = express.Router();

// 获取公告列表 (公开或需登录视需求定，这里设为需登录)
router.get("/", authenticateJWT, getList);

// 获取公告详情
router.get("/:id", authenticateJWT, getDetail);

// 发布公告 (管理员或社团负责人)
// 注意：系统公告需 ADMIN 权限，社团公告需 LEADER 权限。Controller 层会进一步校验。
router.post(
  "/",
  authenticateJWT,
  checkRole([Role.ADMIN, Role.LEADER]),
  create
);

// 更新公告
router.put(
  "/:id",
  authenticateJWT,
  checkRole([Role.ADMIN, Role.LEADER]),
  update
);

// 删除公告
router.delete(
  "/:id",
  authenticateJWT,
  checkRole([Role.ADMIN, Role.LEADER]),
  remove
);

export default router;
