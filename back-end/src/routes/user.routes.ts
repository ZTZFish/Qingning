// src/routes/user.routes.ts

import express from "express"; // 导入 express
import { register, login } from "../controllers/user.controller"; // 导入控制器

const router = express.Router(); // 创建路由实例

// POST /users/register - 注册路由，无需认证
router.post("/register", register);

// POST /users/login - 登录路由，无需认证
router.post("/login", login);

export default router; // 导出路由
