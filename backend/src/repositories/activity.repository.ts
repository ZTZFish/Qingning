// src/repositories/activity.repository.ts

import prisma from "../prisma/client";
import { ActivityStatus } from "@prisma/client";

export const createActivity = async (data: any) => {
  return await prisma.activity.create({
    data: {
      ...data,
      status: ActivityStatus.PENDING, // 初始为待审批
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
        },
      },
    },
  });
};

export const findActivitiesByStatus = async (status: ActivityStatus) => {
  return await prisma.activity.findMany({
    where: { status },
    include: {
      club: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
};

export const updateActivity = async (id: number, data: any) => {
  return await prisma.activity.update({
    where: { id },
    data,
  });
};

export const findAllActivities = async () => {
  return await prisma.activity.findMany({
    include: {
      club: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
};
