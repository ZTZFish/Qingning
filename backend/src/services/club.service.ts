// src/services/club.service.ts

import { ClubType, Status, Role } from "@prisma/client";
import {
  createClub,
  findClubByName,
  findClubsByStatus,
  findClubById,
  updateClub,
  findAllClubs as repositoryFindAllClubs,
} from "../repositories/club.repository";
import { updateUser } from "../repositories/user.repository";
import { deleteFile } from "../utils/file";

export const applyForClub = async (data: {
  name: string;
  type: ClubType;
  description: string;
  coverImage?: string;
  materials?: string;
  leaderId: number;
}) => {
  // 检查名称是否重复
  const existingClub = await findClubByName(data.name);
  if (existingClub) {
    throw new Error("社团名称已存在");
  }

  return await createClub(data);
};

export const getPendingClubs = async (page: number, pageSize: number) => {
  const skip = (page - 1) * pageSize;
  const take = pageSize;
  const { clubs, total } = await findClubsByStatus(Status.PENDING, skip, take);
  return {
    list: clubs,
    total,
    page,
    pageSize,
  };
};

export const auditClubApplication = async (
  clubId: number,
  status: Status,
  reason?: string
) => {
  const club = await findClubById(clubId);
  if (!club) {
    throw new Error("申请不存在");
  }

  if (club.status !== Status.PENDING) {
    throw new Error("该申请已处理");
  }

  // 更新社团状态
  const updatedClub = await updateClub(clubId, { status });

  // 如果审批通过，将申请人的角色提升为 LEADER（如果当前是普通用户）
  if (status === Status.APPROVED) {
    const leader = club.leader;
    if (leader.role === Role.USER) {
      await updateUser(leader.id, { role: Role.LEADER });
    }
  } else if (status === Status.REJECTED) {
    // 如果审批被驳回，删除用户上传的封面和手续照片
    deleteFile(club.coverImage);
    deleteFile(club.materials);
  }

  return updatedClub;
};

export const getAllClubs = async (
  page: number,
  pageSize: number,
  search?: string
) => {
  // 这里可以根据需求过滤，通常管理页面显示所有非删除的，
  // 但用户页面显示 APPROVED 的。
  const skip = (page - 1) * pageSize;
  const take = pageSize;
  const { clubs, total } = await repositoryFindAllClubs(skip, take, search);
  return {
    list: clubs,
    total,
    page,
    pageSize,
  };
};

export const getApprovedClubs = async () => {
  // 获取所有已批准的社团，暂不分页，或者设置一个较大的 limit
  const { clubs } = await findClubsByStatus(Status.APPROVED, 0, 1000);
  return clubs;
};
