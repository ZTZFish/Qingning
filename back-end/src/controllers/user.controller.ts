// src/controllers/user.controller.ts

import { Request, Response } from "express"; // 导入 Express 类型
import { registerUser, loginUser } from "../services/user.service"; // 导入 service 函数

// 注册控制器
export const register = async (req: Request, res: Response) => {
  try {
    // 从请求体中解构 username、email、password
    const { username, email, password } = req.body;

    // 调用 service 注册用户
    const newUser = await registerUser(username, email, password);

    // 返回 201 成功响应，包含新用户数据
    res.status(201).json({
      code: 200,
      message: "User registered successfully",
      data: newUser,
    });
  } catch (error: any) {
    // 捕获错误，返回 400 错误响应
    res.status(400).json({ code: 400, message: error.message });
  }
};

// 登录控制器
export const login = async (req: Request, res: Response) => {
  try {
    // 从请求体中解构 username、password
    const { username, password } = req.body;

    // 调用 service 登录用户
    const { token, user } = await loginUser(username, password);

    // 返回 200 成功响应，包含 token 和用户数据
    console.log("登录成功");
    res.status(200).json({
      code: 200,
      message: "Login successful",
      data: { token, user },
    });
  } catch (error: any) {
    // 捕获错误，返回 401 未授权响应
    res.status(401).json({ code: 401, message: error.message });
  }
};
