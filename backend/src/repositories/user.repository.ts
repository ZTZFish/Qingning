// src/repositories/user.repository.ts

import prisma from "../prisma/client"; // 导入 Prisma Client 单例，确保全局唯一实例，避免连接池问题
import { Role, Sex } from "@prisma/client";

export const createUser = async (data: any) => {
  return await prisma.user.create({
    data,
    select: {
      id: true,
      username: true,
      email: true,
      role: true,
      avatar: true,
      realName: true,
      sex: true,
      studentId: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

export const findUserByUsername = async (username: string) => {
  return await prisma.user.findUnique({
    where: { username, isDeleted: false },
  });
};

// 根据学号查找用户（注册时检查学号唯一性）
export const findUserByStudentId = async (studentId: number) => {
  return await prisma.user.findUnique({
    where: { studentId },
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

export const findAllUsers = async (
  skip: number,
  take: number,
  search?: string
) => {
  const where: any = { isDeleted: false };

  if (search) {
    where.OR = [
      { username: { contains: search } },
      { realName: { contains: search } },
      { email: { contains: search } },
    ];
  }

  const [users, total] = await prisma.$transaction([
    prisma.user.findMany({
      where,
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        avatar: true,
        realName: true,
        sex: true,
        studentId: true,
        createdAt: true,
        updatedAt: true,
        isDeleted: true,
      },
      skip,
      take,
      orderBy: { createdAt: "desc" },
    }),
    prisma.user.count({ where }),
  ]);

  return { users, total };
};

export const updateUser = async (id: number, data: any) => {
  return await prisma.user.update({
    where: { id },
    data,
    select: {
      id: true,
      username: true,
      email: true,
      role: true,
      avatar: true,
      realName: true,
      sex: true,
      studentId: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};
