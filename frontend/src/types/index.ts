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
 * 通用状态枚举 (Status)
 */
export enum Status {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

/**
 * 社团成员状态枚举 (MembershipStatus)
 */
export enum MembershipStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  LEFT = "LEFT",
}

/**
 * 活动状态枚举 (ActivityStatus)
 */
export enum ActivityStatus {
  DRAFT = "DRAFT",
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  ONGOING = "ONGOING",
  FINISHED = "FINISHED",
  CANCELED = "CANCELED",
}

/**
 * 活动参与/报名状态枚举 (ParticipationStatus)
 */
export enum ParticipationStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  ATTENDED = "ATTENDED",
  CANCELED = "CANCELED",
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
  createdAt?: string;
  updatedAt?: string;
  isDeleted?: boolean;
  // 关联字段
  ledClubs?: Club[];
  memberships?: ClubMembership[];
  participated?: UserActivity[];
}

/**
 * 社团接口
 */
export interface Club {
  id: number;
  name: string;
  type: ClubType;
  description: string | null;
  coverImage?: string | null;
  leaderId: number;
  status: Status;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
  // 关联字段
  leader?: User;
  members?: ClubMembership[];
  activities?: Activity[];
  announcements?: Announcement[];
  _count?: {
    members: number;
  };
}

/**
 * 社团成员关系接口
 */
export interface ClubMembership {
  userId: number;
  clubId: number;
  joinedAt: string;
  status: MembershipStatus;
  roleInClub: string | null;
  notes: string | null;
  // 关联字段
  user?: User;
  club?: Club;
}

/**
 * 活动接口
 */
export interface Activity {
  id: number;
  clubId: number;
  name: string;
  description: string | null;
  coverImage: string | null;
  date: string;
  endAt: string;
  location: string | null;
  status: ActivityStatus;
  createdAt: string;
  updatedAt: string;
  // 关联字段
  club?: Club;
  participants?: UserActivity[];
}

/**
 * 用户与活动关联接口 (报名信息)
 */
export interface UserActivity {
  userId: number;
  activityId: number;
  joinedAt: string;
  status: ParticipationStatus;
  notes: string | null;
  // 关联字段
  user?: User;
  activity?: Activity;
}

/**
 * 公告接口
 */
export interface Announcement {
  id: number;
  clubId: number;
  authorId: number | null;
  title: string;
  content: string;
  pinned: boolean;
  createdAt: string;
  updatedAt: string;
  // 关联字段
  club?: Club;
  author?: User;
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

/**
 * 通用列表组件列配置接口
 */
export interface Column {
  label: string;
  prop: string;
  width?: string | number;
  minWidth?: string | number;
  type?: "avatar" | "tag" | "image" | "text";
  tagMap?: Record<string, { label: string; type: string }>;
}
