import request from "@/utils/request";
import type { User } from "@/types";

/**
 * 示例：获取用户信息
 */
export function getUserInfo() {
  return request.get<User>("/user/info");
}

/**
 * 示例：登录
 * @param data 登录信息
 */
export function login(data: any) {
  return request.post<{ token: string; user: User }>("/users/login", data);
}

/**
 * 示例：注册
 * @param data 注册信息
 */
export function register(data: any) {
  return request.post<User>("/users/register", data);
}

/**
 * 示例：获取健康检查状态
 */
export function getHealth() {
  return request.get("/health");
}
