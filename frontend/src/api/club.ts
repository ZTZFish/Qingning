import request from "@/utils/request";
import type { Club, MembershipStatus, Status } from "@/types";

/**
 * 提交社团申请
 * @param data { name, type, description, coverImage }
 */
export function createClub(data: any) {
  return request.post<Club>("/clubs", data);
}

/**
 * 上传社团封面
 * @param formData
 */
export function uploadClubCover(formData: FormData) {
  return request.post<{ url: string }>("/clubs/cover", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

/**
 * 上传社团手续照片
 * @param formData
 */
export function uploadClubMaterials(formData: FormData) {
  return request.post<{ url: string }>("/clubs/materials", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

/**
 * 管理员获取待审批社团列表
 */
export function getPendingClubs(params?: { page: number; pageSize: number }) {
  return request.get<{ list: Club[]; total: number }>("/clubs/pending", {
    params,
  });
}

/**
 * 管理员审批社团
 * @param id 社团ID
 * @param data { status, reason }
 */
export function auditClub(
  id: number,
  data: { status: Status; reason?: string }
) {
  return request.put(`/clubs/${id}/audit`, data);
}

/**
 * 获取所有社团列表（用于管理页面）
 */
export function getClubs(params?: {
  page: number;
  pageSize: number;
  search?: string;
}) {
  return request.get<{ list: Club[]; total: number }>("/clubs", { params });
}

/**
 * 获取用户管理的社团
 * @param userId 用户ID
 */
export function getUserLedClubs(userId: number) {
  return request.get<Club[]>(`/clubs/user/${userId}/led`);
}

/**
 * 获取用户加入的社团
 * @param userId 用户ID
 * @param params 分页参数
 */
export function getUserJoinedClubs(
  userId: number,
  params?: { page: number; pageSize: number }
) {
  return request.get<{ list: Club[]; total: number }>(
    `/clubs/user/${userId}/joined`,
    { params }
  );
}

/**
 * 转让社团负责人
 * @param clubId 社团ID
 * @param newLeaderId 新负责人ID
 */
export function transferClubLeader(clubId: number, newLeaderId: number) {
  return request.put(`/clubs/${clubId}/transfer`, { newLeaderId });
}

/**
 * 获取社团详情（包含当前用户成员状态）
 * @param id 社团ID
 */
export function getClubDetail(id: number) {
  return request.get<
    Club & { isMember: boolean; membershipStatus: MembershipStatus }
  >(`/clubs/${id}`);
}

/**
 * 申请加入社团
 * @param id 社团ID
 */
export function joinClub(id: number) {
  return request.post(`/clubs/${id}/join`);
}

/**
 * 退出社团
 * @param id 社团ID
 */
export function leaveClub(id: number) {
  return request.post(`/clubs/${id}/leave`);
}

/**
 * 获取社团成员列表
 * @param id 社团ID
 * @param params 分页参数
 */
export function getClubMembers(
  id: number,
  params?: { page: number; pageSize: number }
) {
  return request.get<{ list: any[]; total: number }>(`/clubs/${id}/members`, {
    params,
  });
}

/**
 * 获取入社申请列表
 * @param id 社团ID
 * @param params 分页参数
 */
export function getClubApplications(
  id: number,
  params?: { page: number; pageSize: number }
) {
  return request.get<{ list: any[]; total: number }>(
    `/clubs/${id}/applications`,
    { params }
  );
}

/**
 * 审批入社申请
 * @param clubId 社团ID
 * @param memberId 申请人ID
 * @param status 审批状态
 */
export function auditClubApplication(
  clubId: number,
  memberId: number,
  status: "APPROVED" | "REJECTED"
) {
  return request.put(`/clubs/${clubId}/applications/${memberId}`, { status });
}
