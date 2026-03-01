// src/repositories/club.repository.ts

import prisma from "../prisma/client";
import { ClubType, Status, MembershipStatus } from "@prisma/client";

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

export const findClubDetail = async (id: number) => {
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
      _count: {
        select: { members: true },
      },
    },
  });
};

export const findMembership = async (userId: number, clubId: number) => {
  return await prisma.clubMembership.findUnique({
    where: {
      userId_clubId: {
        userId,
        clubId,
      },
    },
  });
};

export const createMembership = async (userId: number, clubId: number) => {
  return await prisma.clubMembership.create({
    data: {
      userId,
      clubId,
      status: MembershipStatus.PENDING, // 默认申请状态
      roleInClub: "MEMBER",
    },
  });
};

export const createLeaderMembership = async (
  userId: number,
  clubId: number
) => {
  return await prisma.clubMembership.create({
    data: {
      userId,
      clubId,
      status: MembershipStatus.APPROVED,
      roleInClub: "LEADER",
    },
  });
};

export const deleteMembership = async (userId: number, clubId: number) => {
  return await prisma.clubMembership.delete({
    where: {
      userId_clubId: {
        userId,
        clubId,
      },
    },
  });
};

export const findClubMembers = async (
  clubId: number,
  skip: number,
  take: number
) => {
  const [members, total] = await prisma.$transaction([
    prisma.clubMembership.findMany({
      where: { clubId, status: MembershipStatus.APPROVED },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            realName: true,
            avatar: true,
            studentId: true,
          },
        },
      },
      skip,
      take,
      // 排序：社长优先，然后按加入时间倒序
      orderBy: [{ roleInClub: "asc" }, { joinedAt: "desc" }],
    }),
    prisma.clubMembership.count({
      where: { clubId, status: MembershipStatus.APPROVED },
    }),
  ]);
  return { members, total };
};

export const findPendingMemberships = async (
  clubId: number,
  skip: number,
  take: number
) => {
  const [members, total] = await prisma.$transaction([
    prisma.clubMembership.findMany({
      where: { clubId, status: MembershipStatus.PENDING },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            realName: true,
            avatar: true,
            studentId: true,
          },
        },
      },
      skip,
      take,
      orderBy: { joinedAt: "asc" }, // 申请早的在前
    }),
    prisma.clubMembership.count({
      where: { clubId, status: MembershipStatus.PENDING },
    }),
  ]);
  return { members, total };
};

export const updateMembershipStatus = async (
  userId: number,
  clubId: number,
  status: MembershipStatus,
  roleInClub?: string
) => {
  return await prisma.clubMembership.update({
    where: {
      userId_clubId: {
        userId,
        clubId,
      },
    },
    data: {
      status,
      roleInClub: roleInClub || undefined,
    },
  });
};

export const findClubsByLeaderId = async (leaderId: number) => {
  return await prisma.club.findMany({
    where: { leaderId, isDeleted: false },
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
      _count: {
        select: { members: true },
      },
    },
    orderBy: { createdAt: "desc" },
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
        _count: {
          select: { members: true },
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

export const findClubsByMemberId = async (
  memberId: number,
  skip: number,
  take: number
) => {
  const where = {
    members: {
      some: {
        userId: memberId,
        status: MembershipStatus.APPROVED, // 只查询已通过的成员关系
      },
    },
    isDeleted: false,
  };

  const [clubs, total] = await prisma.$transaction([
    prisma.club.findMany({
      where,
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
        _count: {
          select: { members: true },
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
            avatar: true,
            role: true,
          },
        },
        _count: {
          select: { members: true },
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
