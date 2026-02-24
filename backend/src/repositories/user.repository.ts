// src/repositories/user.repository.ts

import prisma from "../prisma/client"; // 导入 Prisma Client 单例，确保全局唯一实例，避免连接池问题
import { Role, Sex } from "@prisma/client/index.js";

// 创建新用户（注册时调用）
export const createUser = async (
  username: string,
  email: string,
  password: string,
  role: Role = Role.USER,
  realName: string = "",
  sex: Sex = Sex.UNKNOWN,
  StudentId: number
) => {
  // 使用 prisma.user.create 创建用户记录
  // data 对象包含所有要插入的字段：username、email、password（已加密）、role
  return await prisma.user.create({
    data: {
      username,
      email,
      password, // 这里传入的 password 应该是 bcrypt 加密后的
      role,
      realName,
      sex,
      StudentId,
    },
  });
};

// 根据用户名查找用户（登录时验证用户名是否存在）
export const findUserByUsername = async (username: string) => {
  // 使用 prisma.user.findUnique 查找唯一用户
  // where 指定条件：username 匹配
  return await prisma.user.findUnique({
    where: { username },
  });
};

// 根据学号查找用户（注册时检查学号唯一性）
export const findUserByStudentId = async (StudentId: number) => {
  return await prisma.user.findUnique({
    where: { StudentId },
  });
};

export const findUserByEmail = async (email: string) => {
  // 类似 findUserByUsername，但用 email 作为 where 条件
  return await prisma.user.findUnique({
    where: { email },
  });
};

// 更新用户密码
export const updateUserPassword = async (email: string, password: string) => {
  return await prisma.user.update({
    where: { email },
    data: { password },
  });
};

// 根据 ID 查找用户
export const findUserById = async (id: number) => {
  return await prisma.user.findUnique({
    where: { id },
  });
};

// 获取所有用户（包括已封禁）
export const findAllUsers = async () => {
  return await prisma.user.findMany({
    select: {
      id: true,
      username: true,
      email: true,
      avatar: true,
      role: true,
      realName: true,
      sex: true,
      StudentId: true,
      isDeleted: true,
      createdAt: true,
    },
  });
};

// 更新用户信息
export const updateUser = async (
  id: number,
  data: {
    username?: string;
    avatar?: string;
    email?: string;
    role?: Role;
    isDeleted?: boolean;
  }
) => {
  return await prisma.user.update({
    where: { id },
    data,
  });
};
