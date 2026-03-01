// src/services/club.service.ts

import { ClubType, Status, Role } from "@prisma/client";
import {
  createClub,
  findClubByName,
  findClubsByStatus,
  findClubById,
  updateClub,
  findAllClubs as repositoryFindAllClubs,
  findClubsByLeaderId,
} from "../repositories/club.repository";
import { updateUser, findUserById } from "../repositories/user.repository";
import { deleteFile } from "../utils/file";
import { formatDateTime } from "../utils/date";

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

  // 格式化时间
  const formattedClubs = clubs.map(club => ({
    ...club,
    createdAt: formatDateTime(club.createdAt),
    updatedAt: formatDateTime(club.updatedAt)
  }));

  return {
    list: formattedClubs,
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

  // 格式化时间
  const formattedClubs = clubs.map(club => ({
    ...club,
    createdAt: formatDateTime(club.createdAt),
    updatedAt: formatDateTime(club.updatedAt)
  }));

  return {
    list: formattedClubs,
    total,
    page,
    pageSize,
  };
};

export const getApprovedClubs = async () => {
  // 获取所有已批准的社团，暂不分页，或者设置一个较大的 limit
  const { clubs } = await findClubsByStatus(Status.APPROVED, 0, 1000);

  // 格式化时间
  const formattedClubs = clubs.map(club => ({
    ...club,
    createdAt: formatDateTime(club.createdAt),
    updatedAt: formatDateTime(club.updatedAt)
  }));

  return formattedClubs;
};

export const getUserLedClubs = async (userId: number) => {
  const clubs = await findClubsByLeaderId(userId);

  // 格式化时间
  const formattedClubs = clubs.map(club => ({
    ...club,
    createdAt: formatDateTime(club.createdAt),
    updatedAt: formatDateTime(club.updatedAt)
  }));

  return formattedClubs;
};

export const transferClubLeadership = async (
  clubId: number,
  newLeaderId: number
) => {
  const club = await findClubById(clubId);
  if (!club) {
    throw new Error("社团不存在");
  }

  const oldLeaderId = club.leaderId;

  // 1. 检查新负责人是否存在
  const newLeader = await findUserById(newLeaderId);
  if (!newLeader) {
    throw new Error("新负责人不存在");
  }

  // 2. 更新社团的 leaderId
  await updateClub(clubId, { leaderId: newLeaderId });

  // 3. 将新负责人的角色设为 LEADER
  if (newLeader.role !== Role.LEADER) {
    await updateUser(newLeaderId, { role: Role.LEADER });
  }

  // 4. 检查旧负责人是否还负责其他社团
  const oldLeaderClubs = await findClubsByLeaderId(oldLeaderId);
  // 注意：此时 oldLeaderClubs 可能还包含当前社团（如果事务未提交或并发问题），
  // 但我们已经执行了 updateClub，所以再次查询应该不包含当前社团了。
  // 为了保险起见，过滤掉当前 clubId
  const remainingClubs = oldLeaderClubs.filter((c) => c.id !== clubId);

  if (remainingClubs.length === 0) {
    // 如果没有负责其他社团，降级为 USER
    // 注意：如果旧负责人是 ADMIN，不应该降级，但这里假设只有 LEADER 会被操作
    // 我们可以加一个判断，只有当他是 LEADER 时才降级
    const oldLeader = await findUserById(oldLeaderId);
    if (oldLeader && oldLeader.role === Role.LEADER) {
      await updateUser(oldLeaderId, { role: Role.USER });
    }
  }
};
