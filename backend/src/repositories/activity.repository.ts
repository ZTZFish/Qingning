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
  search?: string
) => {
  const where: any = {
    status: { not: ActivityStatus.PENDING }, // 排除待审批
  };

  if (search) {
    where.OR = [
      { name: { contains: search } },
      { club: { name: { contains: search } } },
    ];
  }

  const [activities, total] = await prisma.$transaction([
    prisma.activity.findMany({
      where,
      include: {
        club: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take,
    }),
    prisma.activity.count({ where }),
  ]);
  return { activities, total };
};
