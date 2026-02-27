import request from "@/utils/request";
import type { Activity, ActivityStatus } from "@/types";

/**
 * 获取活动列表
 */
export function getActivities(params?: {
  page: number;
  pageSize: number;
  search?: string;
}) {
  return request.get<{ list: Activity[]; total: number }>("/activities", {
    params,
  });
}

/**
 * 提交活动发布申请
 */
export function createActivity(data: any) {
  return request.post<Activity>("/activities", data);
}

/**
 * 上传活动封面
 */
export function uploadActivityCover(formData: FormData) {
  return request.post<{ url: string }>("/activities/cover", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

/**
 * 管理员获取待审批活动列表
 */
export function getPendingActivities(params?: {
  page: number;
  pageSize: number;
}) {
  return request.get<{ list: Activity[]; total: number }>(
    "/activities/pending",
    { params }
  );
}

/**
 * 管理员审批活动
 */
export function auditActivity(
  id: number,
  data: { status: ActivityStatus; reason?: string }
) {
  return request.put(`/activities/${id}/audit`, data);
}
