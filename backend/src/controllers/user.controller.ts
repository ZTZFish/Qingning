// src/controllers/user.controller.ts

import { Request, Response } from "express"; // 导入 Express 类型
import {
  registerUser,
  loginUser,
  resetPassword as resetPasswordService,
} from "../services/user.service"; // 导入 service 函数
import { sendCode } from "../services/verification.service";
import { Role } from "@prisma/client";

// 发送验证码控制器
export const sendVerificationCode = async (req: Request, res: Response) => {
  try {
    const { email, type } = req.body;
    if (!email) {
      return res.status(400).json({ code: 400, message: "邮箱不能为空" });
    }
    await sendCode(email, type || "register");
    res.status(200).json({ code: 200, message: "验证码已发送至您的邮箱" });
  } catch (error: any) {
    res.status(500).json({ code: 500, message: error.message });
  }
};

// 注册控制器
export const register = async (req: Request, res: Response) => {
  try {
    // 从请求体中解构 username、email、password, code
    const { username, email, password, code } = req.body;

    // 调用 service 注册用户
    const newUser = await registerUser(username, email, password, code);

    // 返回 201 成功响应，包含新用户数据
    res.status(201).json({
      code: 201,
      message: "注册成功",
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
    // 从请求体中解构 username、password, role
    const { username, password, role } = req.body;

    // 校验 role 是否合法 (可选)
    if (!role || !Object.values(Role).includes(role)) {
      return res.status(400).json({ code: 400, message: "无效的登录身份" });
    }

    // 调用 service 登录用户
    const { token, user } = await loginUser(username, password, role);

    // 返回 200 成功响应，包含 token 和用户数据
    console.log("登录成功");
    res.status(200).json({
      code: 200,
      message: "登录成功",
      data: { token, user },
    });
  } catch (error: any) {
    // 捕获错误，返回 401 未授权响应
    res.status(401).json({ code: 401, message: error.message });
  }
};

// 重置密码控制器
export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { email, code, newPassword } = req.body;
    await resetPasswordService(email, code, newPassword);
    res.status(200).json({ code: 200, message: "密码重置成功" });
  } catch (error: any) {
    res.status(400).json({ code: 400, message: error.message });
  }
};
