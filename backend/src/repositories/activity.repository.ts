// src/repositories/activity.repository.ts

import prisma from "../prisma/client";
import { ActivityStatus, ParticipationStatus } from "@prisma/client";

export const createActivity = async (data: any) => {
  return await prisma.activity.create({
    data: {
      ...data,
      status: ActivityStatus.PENDING, // 提交申请时使用
    },
  });
};

export const createDraftActivity = async (data: any) => {
  return await prisma.activity.create({
    data: {
      ...data,
      status: ActivityStatus.DRAFT, // 保存草稿
    },
  });
};

export const findActivityById = async (id: number) => {
  return await prisma.activity.findUnique({
    where: { id },
    include: {
      club: {
        select: {
          id: true,
          name: true,
          leaderId: true,
          leader: {
            select: {
              id: true,
              username: true,
              realName: true,
              avatar: true,
            },
          },
        },
      },
    },
  });
};

// 查找用户的报名记录
export const findUserParticipation = async (
  userId: number,
  activityId: number
) => {
  return await prisma.userActivity.findUnique({
    where: {
      userId_activityId: {
        userId,
        activityId,
      },
    },
  });
};

// 创建报名记录
export const createUserParticipation = async (
  userId: number,
  activityId: number,
  notes?: string
) => {
  return await prisma.userActivity.create({
    data: {
      userId,
      activityId,
      status: ParticipationStatus.PENDING,
      notes,
    },
  });
};

// 获取活动的报名列表（支持分页与状态筛选）
export const findActivityParticipants = async (
  activityId: number,
  skip: number,
  take: number,
  status?: ParticipationStatus
) => {
  const where: any = { activityId };
  if (status) {
    where.status = status;
  }

  const [participants, total] = await prisma.$transaction([
    prisma.userActivity.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            username: true,
            realName: true,
            avatar: true,
            studentId: true,
            sex: true,
          },
        },
      },
      orderBy: { joinedAt: "desc" },
      skip,
      take,
    }),
    prisma.userActivity.count({ where }),
  ]);

  return { participants, total };
};

// 更新报名状态
export const updateUserParticipationStatus = async (
  userId: number,
  activityId: number,
  status: ParticipationStatus
) => {
  return await prisma.userActivity.update({
    where: {
      userId_activityId: {
        userId,
        activityId,
      },
    },
    data: { status },
  });
};

export const findActivitiesByStatus = async (
  status: ActivityStatus,
  skip: number,
  take: number
) => {
  const [activities, total] = await prisma.$transaction([
    prisma.activity.findMany({
      where: { status },
      include: {
        club: {
          select: {
            id: true,
            name: true,
            leader: {
              select: {
                id: true,
                username: true,
                realName: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take,
    }),
    prisma.activity.count({ where: { status } }),
  ]);
  return { activities, total };
};

export const updateActivity = async (id: number, data: any) => {
  return await prisma.activity.update({
    where: { id },
    data,
  });
};

export const findAllActivities = async (
  skip: number,
  take: number,
  search?: string,
  clubId?: number,
  leaderId?: number, // 新增参数：按负责人ID筛选
  statuses?: ActivityStatus[]
) => {
  const where: any = { isDeleted: false };

  if (search) {
    where.OR = [
      { name: { contains: search } },
      { club: { name: { contains: search } } },
    ];
  }

  if (clubId) {
    where.clubId = clubId;
  }

  // 如果指定了负责人ID，则只查询该负责人管理的社团下的活动
  if (leaderId) {
    where.club = {
      leaderId: leaderId,
    };
  }

  if (statuses && statuses.length > 0) {
    where.status = { in: statuses };
  }

  const [activities, total] = await prisma.$transaction([
    prisma.activity.findMany({
      where,
      include: {
        club: {
          select: {
            name: true,
            leader: {
              select: { id: true, username: true, realName: true },
            },
          },
        },
      },
      skip,
      take,
      orderBy: { createdAt: "desc" },
    }),
    prisma.activity.count({ where }),
  ]);

  return { activities, total };
};
