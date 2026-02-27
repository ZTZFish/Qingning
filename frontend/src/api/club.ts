import request from "@/utils/request";
import type { Club, Status } from "@/types";

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
