// src/repositories/club.repository.ts

import prisma from "../prisma/client";
import { ClubType, Status } from "@prisma/client";

export const createClub = async (data: {
  name: string;
  type: ClubType;
  description: string;
  coverImage?: string;
  materials?: string;
  leaderId: number;
}) => {
  return await prisma.club.create({
    data: {
      name: data.name,
      type: data.type,
      description: data.description,
      coverImage: data.coverImage,
      materials: data.materials,
      leaderId: data.leaderId,
      status: Status.PENDING, // 初始状态为待审批
    },
  });
};

export const findClubById = async (id: number) => {
  return await prisma.club.findUnique({
    where: { id },
    include: {
      leader: {
        select: {
          id: true,
          username: true,
          realName: true,
          avatar: true,
          role: true,
        },
      },
    },
  });
};

export const findClubByName = async (name: string) => {
  return await prisma.club.findUnique({
    where: { name },
  });
};

export const findClubsByStatus = async (
  status: Status,
  skip: number,
  take: number
) => {
  const [clubs, total] = await prisma.$transaction([
    prisma.club.findMany({
      where: { status, isDeleted: false },
      include: {
        leader: {
          select: {
            id: true,
            username: true,
            realName: true,
            avatar: true,
            role: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take,
    }),
    prisma.club.count({ where: { status, isDeleted: false } }),
  ]);
  return { clubs, total };
};

export const updateClub = async (id: number, data: any) => {
  return await prisma.club.update({
    where: { id },
    data,
  });
};

export const findAllClubs = async (
  skip: number,
  take: number,
  search?: string
) => {
  const where: any = {
    isDeleted: false,
    status: { not: Status.PENDING }, // 默认排除待审批的，因为它们在审核列表
  };

  if (search) {
    where.OR = [
      { name: { contains: search } },
      { leader: { realName: { contains: search } } },
    ];
  }

  const [clubs, total] = await prisma.$transaction([
    prisma.club.findMany({
      where,
      include: {
        leader: {
          select: {
            id: true,
            username: true,
            realName: true,
            role: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take,
    }),
    prisma.club.count({ where }),
  ]);
  return { clubs, total };
};
