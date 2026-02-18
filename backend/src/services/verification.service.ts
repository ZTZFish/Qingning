import prisma from '../prisma/client';
import { sendVerificationEmail } from './email.service';

/**
 * 生成 6 位数字验证码
 */
const generateCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * 发送并存储验证码
 * @param email 邮箱地址
 */
export const sendCode = async (email: string) => {
  const code = generateCode();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 分钟后过期

  // 存储到数据库（如果已存在则更新）
  await prisma.verificationCode.upsert({
    where: { email },
    update: { code, expiresAt },
    create: { email, code, expiresAt },
  });

  // 发送邮件
  await sendVerificationEmail(email, code);
};

/**
 * 校验验证码
 * @param email 邮箱
 * @param code 验证码
 */
export const verifyCode = async (email: string, code: string) => {
  const record = await prisma.verificationCode.findUnique({
    where: { email },
  });

  if (!record) {
    throw new Error('请先获取验证码');
  }

  if (record.code !== code) {
    throw new Error('验证码错误');
  }

  if (new Date() > record.expiresAt) {
    throw new Error('验证码已过期，请重新获取');
  }

  // 验证成功后删除记录
  await prisma.verificationCode.delete({
    where: { email },
  });

  return true;
};
