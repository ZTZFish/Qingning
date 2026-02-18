// src/routes/user.routes.ts

import express from "express";
import { register } from "../controllers/user.controller";

const router = express.Router();

// POST /api/users - 注册（创建用户资源）
router.post("/", register);

export default router;
