// src/prisma/client.ts
import { PrismaClient } from "@prisma/client/index.js";

/**
 * 为了防止在开发环境下由于热重载（Hot Reloading）导致创建多个 PrismaClient 实例，
 * 我们将实例存储在全局对象 globalThis 中。
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

/**
 * 导出单例 PrismaClient 实例。
 * 如果全局对象中已经存在实例，则复用它；否则创建一个新实例。
 */
export const prisma = globalForPrisma.prisma ?? new PrismaClient();

/**
 * 在非生产环境下，将实例保存到全局对象中。
 * 这样在下一次代码热重载时，可以从 globalThis.prisma 中获取到已有的实例。
 */
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
