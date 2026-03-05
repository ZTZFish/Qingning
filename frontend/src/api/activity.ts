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

export function createActivityDraft(data: any) {
  return request.post<Activity>("/activities/draft", data);
}

export function submitActivity(id: number, data: any) {
  return request.put<Activity>(`/activities/${id}/submit`, data);
}

export function updateActivityDraft(id: number, data: any) {
  return request.put<Activity>(`/activities/${id}`, data);
}

export function cancelActivity(id: number) {
  return request.put<Activity>(`/activities/${id}/cancel`);
}

export function deleteActivity(id: number) {
  return request.delete(`/activities/${id}`);
}

export function getActivityDetail(id: number) {
  return request.get<Activity>(`/activities/${id}`);
}

/**
 * 报名活动
 */
export function enrollActivity(id: number, notes?: string) {
  return request.post(`/activities/${id}/enroll`, { notes });
}

/**
 * 获取报名名单（负责人）
 */
export function getActivityEnrollments(
  id: number,
  params: { page: number; pageSize: number; status?: string }
) {
  return request.get<{ list: any[]; total: number }>(
    `/activities/${id}/enrollments`,
    {
      params,
    }
  );
}

/**
 * 获取活动已录取名单（公开）
 */
export function getAdmittedMembers(id: number) {
  return request.get<{ list: any[]; total: number }>(
    `/activities/${id}/admitted`,
    {
      params: {
        page: 1,
        pageSize: 100,
        public: "true",
        status: "APPROVED",
      },
    }
  );
}

/**
 * 审核报名（负责人）
 */
export function auditEnrollment(
  id: number,
  userId: number,
  status: "APPROVED" | "REJECTED"
) {
  return request.put(`/activities/${id}/enrollments/${userId}`, { status });
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
