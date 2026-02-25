// src/services/activity.service.ts

import {
  createActivity,
  findActivitiesByStatus,
  findActivityById,
  updateActivity,
  findAllActivities as repositoryFindAllActivities,
} from "../repositories/activity.repository";
import { deleteFile } from "../utils/file";
import { ActivityStatus } from "@prisma/client";

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

export const getPendingActivities = async () => {
  return await findActivitiesByStatus(ActivityStatus.PENDING);
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

  return updatedActivity;
};

export const getAllActivities = async () => {
  return await repositoryFindAllActivities();
};
