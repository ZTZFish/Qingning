// src/services/user.service.ts

import bcrypt from "bcrypt"; // 导入 bcrypt 用于密码加密和比对
import jwt from "jsonwebtoken"; // 导入 jsonwebtoken 用于生成 JWT token
import {
  createUser,
  findUserByUsername,
  findUserByEmail,
} from "../repositories/user.repository"; // 导入 repository 函数

const SALT_ROUNDS = 10; // bcrypt 加密的盐轮数，10 是标准值，平衡安全和性能

// 注册用户服务
export const registerUser = async (
  username: string,
  email: string,
  password: string
) => {
  // 先检查用户名是否已存在，如果存在抛出错误
  const existingUser = await findUserByUsername(username);
  if (existingUser) {
    throw new Error("Username already exists");
  }

  // 检查 email 是否已存在，如果存在抛出错误
  const existingEmail = await findUserByEmail(email);
  if (existingEmail) {
    throw new Error("Email already exists");
  }

  // 使用 bcrypt.hash 加密密码，SALT_ROUNDS 指定加密强度
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  // 调用 repository 创建用户，传入加密后的密码
  const newUser = await createUser(username, email, hashedPassword);

  // 返回新用户（但不返回密码，安全考虑）
  return {
    id: newUser.id,
    username: newUser.username,
    email: newUser.email,
    role: newUser.role,
  };
};

// 登录用户服务
export const loginUser = async (username: string, password: string) => {
  // 查找用户，如果不存在抛出错误
  const user = await findUserByUsername(username);
  if (!user) {
    throw new Error("Invalid username or password");
  }

  // 使用 bcrypt.compare 比对输入密码和数据库加密密码
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error("Invalid username or password");
  }

  // 生成 JWT token：payload 包含用户 id 和 role，签名用 .env 中的 JWT_SECRET，过期时间 1 小时
  const token = jwt.sign(
    { userId: user.id, role: user.role },
    process.env.JWT_SECRET as string,
    { expiresIn: "1h" } // token 有效期，可调整
  );

  // 返回 token 和用户基本信息
  return {
    token,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    },
  };
};
