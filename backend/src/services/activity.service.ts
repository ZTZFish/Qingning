// src/services/activity.service.ts

import {
  createActivity,
  createDraftActivity,
  findActivitiesByStatus,
  findActivityById,
  updateActivity,
  findAllActivities as repositoryFindAllActivities,
  findUserParticipation,
  createUserParticipation,
  findActivityParticipants,
  updateUserParticipationStatus,
} from "../repositories/activity.repository";
import { findClubById } from "../repositories/club.repository";
import { findUserById } from "../repositories/user.repository";
import { formatDateTime } from "../utils/date";
import { deleteFile } from "../utils/file";
import { ActivityStatus, ParticipationStatus } from "@prisma/client";
import { createPersonalMessage } from "./announcement.service";

const deriveStatus = (
  status: ActivityStatus,
  date: Date,
  endAt: Date
): ActivityStatus => {
  if (status === ActivityStatus.APPROVED) {
    const now = new Date();
    if (now >= endAt) return ActivityStatus.FINISHED;
    if (now >= date) return ActivityStatus.ONGOING;
    return ActivityStatus.APPROVED;
  }
  return status;
};

// 检查是否可以报名（辅助函数）
const canEnroll = (
  status: ActivityStatus,
  date: Date,
  endAt: Date
): boolean => {
  const currentStatus = deriveStatus(status, date, endAt);
  // 只有“已发布”状态（未开始）或“进行中”状态可以报名，且必须在结束时间之前
  // 实际业务中通常只允许开始前报名，或者进行中也可以报名，这里假设进行中也可以报名
  return (
    currentStatus === ActivityStatus.APPROVED ||
    currentStatus === ActivityStatus.ONGOING
  );
};

export const publishActivity = async (data: {
  clubId: number;
  name: string;
  description: string;
  coverImage?: string;
  date: Date;
  endAt: Date;
  location?: string;
}) => {
  return await createActivity(data);
};

export const saveActivityDraft = async (
  operatorId: number,
  data: Partial<{
    clubId: number;
    name: string;
    description: string;
    coverImage?: string;
    date: Date;
    endAt: Date;
    location?: string;
  }>
) => {
  if (!data.clubId) throw new Error("缺少社团ID");
  const club = await findClubById(data.clubId);
  if (!club) throw new Error("社团不存在");
  const operator = await findUserById(operatorId);
  if (!operator) throw new Error("用户不存在");
  if (club.leaderId !== operatorId) throw new Error("无权操作");

  // 填充必填字段的临时默认值
  const name = data.name || "未命名活动";
  const now = new Date();
  const date = data.date || now;
  const endAt = data.endAt || new Date(now.getTime() + 60 * 60 * 1000); // 1小时后

  return await createDraftActivity({
    clubId: data.clubId,
    name,
    description: data.description || "",
    coverImage: data.coverImage,
    date,
    endAt,
    location: data.location || "",
  });
};

export const cancelActivity = async (operatorId: number, id: number) => {
  const activity = await findActivityById(id);
  if (!activity) throw new Error("活动不存在");
  const club = await findClubById(activity.clubId);
  if (!club) throw new Error("社团不存在");
  const operator = await findUserById(operatorId);
  if (!operator) throw new Error("用户不存在");
  // 负责人且为本社团
  if (club.leaderId !== operatorId) throw new Error("无权取消该活动");
  if (activity.status === ActivityStatus.CANCELED) {
    return activity;
  }
  return await updateActivity(id, { status: ActivityStatus.CANCELED });
};

export const adminDeleteActivity = async (operatorId: number, id: number) => {
  const activity = await findActivityById(id);
  if (!activity) throw new Error("活动不存在");
  const operator = await findUserById(operatorId);
  if (!operator) throw new Error("用户不存在");
  // 仅管理员可删除
  // 这里采用软删除（isDeleted = true），避免数据丢失
  return await updateActivity(id, { isDeleted: true });
};

export const getActivityDetail = async (operatorId: number, id: number) => {
  const activity = await findActivityById(id);
  if (!activity || (activity as any).isDeleted) {
    throw new Error("活动不存在");
  }
  const operator = await findUserById(operatorId);
  if (!operator) throw new Error("用户不存在");

  let canView = false;
  if (operator.role === "ADMIN") {
    canView = true;
  } else if (operator.role === "LEADER") {
    const club = await findClubById(activity.clubId);
    if (club && club.leaderId === operatorId) {
      canView = true;
    }
  }

  // 普通用户或非本社团负责人在特定状态下可见
  if (!canView) {
    if (
      activity.status === ActivityStatus.APPROVED ||
      activity.status === ActivityStatus.ONGOING ||
      activity.status === ActivityStatus.FINISHED
    ) {
      canView = true;
    }
  }

  if (!canView) {
    throw new Error("无权查看该活动");
  }

  const nextStatus = deriveStatus(
    activity.status as ActivityStatus,
    activity.date as any,
    activity.endAt as any
  );

  // 检查当前用户报名状态
  const participation = await findUserParticipation(operatorId, id);

  return {
    ...activity,
    status: nextStatus,
    date: formatDateTime(activity.date),
    endAt: formatDateTime(activity.endAt),
    myParticipation: participation
      ? {
          status: participation.status,
          joinedAt: formatDateTime(participation.joinedAt),
          notes: participation.notes,
        }
      : null,
  } as any;
};

// 用户报名活动
export const enrollActivity = async (
  userId: number,
  activityId: number,
  notes?: string
) => {
  const activity = await findActivityById(activityId);
  if (!activity || (activity as any).isDeleted) {
    throw new Error("活动不存在");
  }

  // 检查活动状态是否允许报名
  if (!canEnroll(activity.status, activity.date, activity.endAt)) {
    throw new Error("当前活动状态不可报名");
  }

  // 检查是否已报名
  const existing = await findUserParticipation(userId, activityId);
  if (existing) {
    throw new Error("您已报名该活动，请勿重复报名");
  }

  return await createUserParticipation(userId, activityId, notes);
};

// 获取活动报名名单（支持公开获取已录取的名单）
export const getActivityEnrollments = async (
  operatorId: number,
  activityId: number,
  page: number,
  pageSize: number,
  status?: ParticipationStatus,
  publicView: boolean = false
) => {
  const activity = await findActivityById(activityId);
  if (!activity) throw new Error("活动不存在");

  if (!publicView) {
    const club = await findClubById(activity.clubId);
    if (!club) throw new Error("社团不存在");

    if (club.leaderId !== operatorId) {
      throw new Error("无权查看报名名单");
    }
  } else {
    // 公开视图只能看已通过的名单
    // 注意：这里我们覆盖了传入的 status 参数，强制为 APPROVED
    // 但 repository 层的 findActivityParticipants 会检查 status 是否 undefined
    // 如果这里赋值了，repository 就会加上 where.status = 'APPROVED'
    status = ParticipationStatus.APPROVED;
  }

  const skip = (page - 1) * pageSize;
  const take = pageSize;

  const { participants, total } = await findActivityParticipants(
    activityId,
    skip,
    take,
    status
  );

  const list = participants.map((p) => ({
    ...p.user,
    joinedAt: formatDateTime(p.joinedAt),
    status: p.status,
    // 公开视图不返回备注
    notes: publicView ? undefined : p.notes,
  }));

  return {
    list,
    total,
    page,
    pageSize,
  };
};

// 审核报名（社团负责人）
export const auditEnrollment = async (
  operatorId: number,
  activityId: number,
  userId: number,
  status: ParticipationStatus
) => {
  const activity = await findActivityById(activityId);
  if (!activity) throw new Error("活动不存在");

  const club = await findClubById(activity.clubId);
  if (!club) throw new Error("社团不存在");

  if (club.leaderId !== operatorId) {
    throw new Error("无权审核报名");
  }

  // 允许操作为 APPROVED, REJECTED, CANCELED
  if (
    status !== ParticipationStatus.APPROVED &&
    status !== ParticipationStatus.REJECTED &&
    status !== ParticipationStatus.CANCELED
  ) {
    throw new Error("无效的审核状态");
  }

  return await updateUserParticipationStatus(userId, activityId, status);
};

export const updateActivityDraft = async (
  operatorId: number,
  id: number,
  data: Partial<{
    name: string;
    description: string;
    coverImage?: string;
    date: Date;
    endAt: Date;
    location?: string;
  }>
) => {
  const activity = await findActivityById(id);
  if (!activity || (activity as any).isDeleted) throw new Error("活动不存在");
  const club = await findClubById(activity.clubId);
  if (!club) throw new Error("社团不存在");
  const operator = await findUserById(operatorId);
  if (!operator) throw new Error("用户不存在");
  if (operator.role !== "LEADER" || club.leaderId !== operatorId) {
    throw new Error("无权编辑该活动");
  }

  if (
    activity.status !== ActivityStatus.DRAFT &&
    activity.status !== ActivityStatus.REJECTED
  ) {
    throw new Error("当前状态不可编辑");
  }

  const nextData: any = { ...data };
  // 驳回后再次保存，回到草稿，等待重新提交
  if (activity.status === ActivityStatus.REJECTED) {
    nextData.status = ActivityStatus.DRAFT;
  }

  if (nextData.date && nextData.endAt && nextData.endAt <= nextData.date) {
    throw new Error("结束时间必须晚于开始时间");
  }

  return await updateActivity(id, nextData);
};

export const submitActivityApplication = async (
  operatorId: number,
  activityId: number,
  data: {
    name: string;
    description: string;
    coverImage?: string;
    date: Date;
    endAt: Date;
    location?: string;
  }
) => {
  const activity = await findActivityById(activityId);
  if (!activity) throw new Error("活动不存在");
  const club = await findClubById(activity.clubId);
  if (!club) throw new Error("社团不存在");
  const operator = await findUserById(operatorId);
  if (!operator) throw new Error("用户不存在");
  if (club.leaderId !== operatorId) throw new Error("无权操作");

  if (!data.name || !data.date || !data.endAt) {
    throw new Error("请填写必要信息");
  }
  if (data.endAt <= data.date) {
    throw new Error("结束时间必须晚于开始时间");
  }

  return await updateActivity(activityId, {
    ...data,
    status: ActivityStatus.PENDING,
  });
};

export const getPendingActivities = async (page: number, pageSize: number) => {
  const skip = (page - 1) * pageSize;
  const take = pageSize;
  const { activities, total } = await findActivitiesByStatus(
    ActivityStatus.PENDING,
    skip,
    take
  );
  return {
    list: activities.map((a: any) => ({
      ...a,
      date: formatDateTime(a.date),
      endAt: formatDateTime(a.endAt),
      createdAt: formatDateTime(a.createdAt),
      leaderName: a.club?.leader?.realName || a.club?.leader?.username || "",
    })),
    total,
    page,
    pageSize,
  };
};

export const auditActivityApplication = async (
  activityId: number,
  status: ActivityStatus,
  reason?: string
) => {
  const activity = await findActivityById(activityId);
  if (!activity) {
    throw new Error("活动申请不存在");
  }

  if (activity.status !== ActivityStatus.PENDING) {
    throw new Error("该申请已处理");
  }

  // 更新活动状态
  const updatedActivity = await updateActivity(activityId, { status });

  // 如果审批被驳回，删除活动封面图
  if (status === ActivityStatus.REJECTED) {
    deleteFile(activity.coverImage);
  }

  if ((activity as any).club?.leaderId) {
    const title = "活动审批结果通知";
    const statusText =
      status === ActivityStatus.APPROVED
        ? "已通过"
        : status === ActivityStatus.REJECTED
        ? "已驳回"
        : `状态已更新为 ${status}`;
    const content = `您提交的活动「${activity.name}」${statusText}${
      status === ActivityStatus.REJECTED && reason ? `，原因：${reason}` : ""
    }。`;

    await createPersonalMessage({
      targetId: (activity as any).club.leaderId,
      title,
      content,
    });
  }

  return updatedActivity;
};

export const getAllActivities = async (
  page: number,
  pageSize: number,
  search?: string,
  clubId?: number,
  leaderId?: number, // 新增参数
  statuses?: ActivityStatus[]
) => {
  const skip = (page - 1) * pageSize;
  const take = pageSize;
  const { activities, total } = await repositoryFindAllActivities(
    skip,
    take,
    search,
    clubId,
    leaderId,
    statuses
  );
  return {
    list: activities.map((a) => {
      const nextStatus = deriveStatus(
        a.status as ActivityStatus,
        a.date as any,
        a.endAt as any
      );
      return {
        ...a,
        status: nextStatus,
        date: formatDateTime(a.date),
        endAt: formatDateTime(a.endAt),
      };
    }),
    total,
    page,
    pageSize,
  };
};
