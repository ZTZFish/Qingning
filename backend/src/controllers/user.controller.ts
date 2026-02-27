// src/controllers/user.controller.ts

import { Request, Response } from "express"; // 导入 Express 类型
import {
  registerUser,
  loginUser,
  resetPassword as resetPasswordService,
  getUserProfile,
  updateUserProfile,
  updateUserEmail,
  getAllUserList,
  adminUpdateUser,
} from "../services/user.service"; // 导入 service 函数
import { sendCode } from "../services/verification.service";
import { deleteFile } from "../utils/file";
import { Role, Sex } from "@prisma/client";

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
    // 从请求体中解构 username, email, password, code, realName, sex, StudentId
    const { username, email, password, code, realName, sex, StudentId } =
      req.body;

    // 简单校验
    if (!realName) {
      return res.status(400).json({ code: 400, message: "真实姓名不能为空" });
    }
    if (!sex || !Object.values(Sex).includes(sex)) {
      return res.status(400).json({ code: 400, message: "性别无效" });
    }
    if (!StudentId) {
      return res.status(400).json({ code: 400, message: "学号不能为空" });
    }
    // 验证学号格式：8位数字
    if (!/^\d{8}$/.test(String(StudentId))) {
      return res.status(400).json({ code: 400, message: "学号必须是8位数字" });
    }

    // 转换 StudentId 为数字 (如果前端传的是字符串)
    const studentIdInt = parseInt(String(StudentId), 10);

    // 调用 service 注册用户
    const newUser = await registerUser(
      username,
      email,
      password,
      code,
      realName,
      sex,
      studentIdInt
    );

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

// 上传头像控制器
export const uploadAvatar = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ code: 400, message: "请选择要上传的图片" });
    }

    const userId = (req as any).user.id;
    // 获取当前用户信息，以便删除旧头像
    const user = await getUserProfile(userId);
    if (user.avatar) {
      deleteFile(user.avatar);
    }

    // 构建相对路径 URL
    const avatarUrl = `/uploads/avatars/${req.file.filename}`;

    // 更新用户数据库中的头像字段
    await updateUserProfile(userId, { avatar: avatarUrl });

    res.status(200).json({
      code: 200,
      message: "头像上传成功",
      data: { avatar: avatarUrl },
    });
  } catch (error: any) {
    res.status(500).json({ code: 500, message: error.message });
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

// 获取所有用户列表（管理员专用）
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string, 10) || 1;
    const pageSize = parseInt(req.query.pageSize as string, 10) || 10;
    const search = (req.query.search as string) || undefined;
    const result = await getAllUserList(page, pageSize, search);
    res.status(200).json({
      code: 200,
      message: "获取成功",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({ code: 500, message: error.message });
  }
};

// 管理员更新用户信息
export const adminUpdateUserInfo = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { role, isDeleted } = req.body;

    const targetUserId = parseInt(userId, 10);
    const currentUserId = (req as any).user.id;

    // 防止管理员删除自己
    if (currentUserId === targetUserId && isDeleted === true) {
      return res.status(400).json({ code: 400, message: "不能删除自己" });
    }

    await adminUpdateUser(targetUserId, { role, isDeleted });
    res.status(200).json({
      code: 200,
      message: "更新成功",
    });
  } catch (error: any) {
    res.status(400).json({ code: 400, message: error.message });
  }
};

// 获取用户资料控制器
export const getProfile = async (req: Request, res: Response) => {
  try {
    // 从 req.user 中获取 userId（由 authenticateJWT 中间件设置）
    const userId = (req as any).user.id;
    const sessionRole = (req as any).user.role; // 获取登录时选择的会话角色

    const user = await getUserProfile(userId);

    // 将数据库中的角色替换为会话角色，确保前端菜单与登录身份一致
    const userWithSessionRole = {
      ...user,
      role: sessionRole,
    };

    res.status(200).json({
      code: 200,
      message: "获取成功",
      data: userWithSessionRole,
    });
  } catch (error: any) {
    res.status(400).json({ code: 400, message: error.message });
  }
};

// 更新用户资料控制器
export const updateProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { username, avatar } = req.body;
    await updateUserProfile(userId, { username, avatar });
    res.status(200).json({
      code: 200,
      message: "更新成功",
    });
  } catch (error: any) {
    res.status(400).json({ code: 400, message: error.message });
  }
};

// 更新用户邮箱控制器
export const updateEmail = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ code: 400, message: "参数不完整" });
    }
    await updateUserEmail(userId, email, password);
    res.status(200).json({
      code: 200,
      message: "邮箱更新成功",
    });
  } catch (error: any) {
    res.status(400).json({ code: 400, message: error.message });
  }
};
