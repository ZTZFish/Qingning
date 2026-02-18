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
 * 示例：获取健康检查状态
 */
export function getHealth() {
  return request.get("/health");
}
