import request from "@/utils/request";
import type { User, LoginResponse } from "@/types";

/**
 * 示例：登录
 * @param data 登录信息
 */
export function login(data: any) {
  return request.post<LoginResponse>("/auth/login", data);
}

/**
 * 示例：注册
 * @param data 注册信息
 */
export function register(data: any) {
  return request.post<User>("/users", data);
}

/**
 * 示例：发送验证码
 * @param email 邮箱
 */
export function sendCode(email: string) {
  return request.post("/auth/code", { email });
}

/**
 * 重置密码
 * @param data 重置密码信息
 */
export function resetPassword(data: any) {
  return request.post("/auth/reset-password", data);
}

/**
 * 获取当前用户信息
 */
export function getUserInfo() {
  return request.get<User>("/users/me");
}

/**
 * 更新用户信息
 * @param data { username?: string; avatar?: string }
 */
export function updateUserInfo(data: { username?: string; avatar?: string }) {
  return request.put("/users/me", data);
}

/**
 * 更新用户邮箱
 * @param data { email: string; password: string }
 */
export function updateUserEmail(data: { email: string; password: string }) {
  return request.put("/users/me/email", data);
}
