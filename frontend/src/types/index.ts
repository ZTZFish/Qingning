/**
 * 角色枚举
 */
export enum Role {
  ADMIN = "ADMIN",
  LEADER = "LEADER",
  USER = "USER",
}

/**
 * 性别枚举
 */
export enum Sex {
  UNKNOWN = "UNKNOWN",
  MALE = "MALE",
  FEMALE = "FEMALE",
}

/**
 * 状态枚举 (用于社团申请、活动申请等)
 */
export enum Status {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

/**
 * 社团类型枚举
 */
export enum ClubType {
  ACADEMIC = "ACADEMIC",
  SPORTS = "SPORTS",
  ARTS = "ARTS",
  VOLUNTEER = "VOLUNTEER",
  TECH = "TECH",
  ENTERTAINMENT = "ENTERTAINMENT",
  OTHER = "OTHER",
}

/**
 * 用户接口
 */
export interface User {
  id: number;
  username: string;
  email: string;
  role: Role;
  avatar?: string | null;
  realName?: string;
  sex?: Sex;
  StudentId?: number;
  // 关联字段 (可选，根据 API 返回情况使用)
  ledClubs?: Club[];
  activities?: UserActivity[];
}

/**
 * 社团接口
 */
export interface Club {
  id: number;
  name: string;
  description: string | null;
  coverImage?: string | null; // 社团封面
  type?: ClubType; // 社团类型
  leaderId: number;
  status: Status;
  createdAt: string; // ISO 8601 字符串
  updatedAt: string; // ISO 8601 字符串
  // 关联字段
  leader?: User;
  activities?: Activity[];
  announcements?: Announcement[];
  _count?: {
    members: number; // 成员数量
  };
}

/**
 * 活动接口
 */
export interface Activity {
  id: number;
  clubId: number;
  name: string;
  description: string | null;
  date: string; // 活动开始时间 ISO 8601
  endAt: string; // 活动结束时间 ISO 8601
  location: string | null;
  status: Status;
  createdAt: string;
  // 关联字段
  club?: Club;
  participants?: UserActivity[];
}

/**
 * 公告接口
 */
export interface Announcement {
  id: number;
  clubId: number;
  title: string;
  content: string;
  pinned: boolean;
  createdAt: string;
  // 关联字段
  club?: Club;
}

/**
 * 用户与活动关联接口 (报名信息)
 */
export interface UserActivity {
  userId: number;
  activityId: number;
  joinedAt: string;
  status: Status;
  // 关联字段
  user?: User;
  activity?: Activity;
}

/**
 * 通用响应数据结构
 */
export interface ResponseData<T = any> {
  code: number;
  data: T;
  message: string;
}

/**
 * 登录响应接口
 */
export interface LoginResponse {
  token: string;
  user: User;
}
