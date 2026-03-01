// src/services/club.service.ts

import { ClubType, Status, Role, MembershipStatus } from "@prisma/client";
import {
  createClub,
  findClubByName,
  findClubsByStatus,
  findClubById,
  updateClub,
  findAllClubs as repositoryFindAllClubs,
  findClubsByLeaderId,
  findClubsByMemberId,
  findClubDetail,
  findMembership,
  createMembership,
  deleteMembership,
  findClubMembers,
  createLeaderMembership,
  findPendingMemberships,
  updateMembershipStatus,
} from "../repositories/club.repository";
import { updateUser, findUserById } from "../repositories/user.repository";
import { deleteFile } from "../utils/file";
import { formatDateTime } from "../utils/date";

export const getClubInfo = async (clubId: number, userId: number) => {
  const club = await findClubDetail(clubId);
  if (!club) {
    throw new Error("社团不存在");
  }

  // 获取当前用户的成员状态
  const membership = await findMembership(userId, clubId);
  const isMember = !!membership;
  const membershipStatus = membership?.status;

  return {
    ...club,
    createdAt: formatDateTime(club.createdAt),
    updatedAt: formatDateTime(club.updatedAt),
    isMember,
    membershipStatus,
  };
};

export const joinClub = async (userId: number, clubId: number) => {
  const club = await findClubById(clubId);
  if (!club) {
    throw new Error("社团不存在");
  }

  const existingMembership = await findMembership(userId, clubId);
  if (existingMembership) {
    throw new Error("您已加入或申请过该社团");
  }

  return await createMembership(userId, clubId);
};

export const leaveClub = async (userId: number, clubId: number) => {
  const club = await findClubById(clubId);
  if (!club) {
    throw new Error("社团不存在");
  }

  if (club.leaderId === userId) {
    throw new Error("社团负责人退出社团请联系管理员");
  }

  const existingMembership = await findMembership(userId, clubId);
  if (!existingMembership) {
    throw new Error("您不是该社团成员");
  }

  return await deleteMembership(userId, clubId);
};

export const getPendingApplications = async (
  clubId: number,
  userId: number,
  page: number,
  pageSize: number
) => {
  const club = await findClubById(clubId);
  if (!club) {
    throw new Error("社团不存在");
  }

  if (club.leaderId !== userId) {
    throw new Error("无权查看申请列表");
  }

  const skip = (page - 1) * pageSize;
  const take = pageSize;
  const { members, total } = await findPendingMemberships(clubId, skip, take);

  const list = members.map((m) => ({
    ...m.user,
    joinedAt: formatDateTime(m.joinedAt),
    notes: m.notes,
  }));

  return {
    list,
    total,
    page,
    pageSize,
  };
};

export const auditMembership = async (
  clubId: number,
  leaderId: number,
  memberId: number,
  status: MembershipStatus
) => {
  const club = await findClubById(clubId);
  if (!club) {
    throw new Error("社团不存在");
  }

  if (club.leaderId !== leaderId) {
    throw new Error("无权操作");
  }

  if (
    status !== MembershipStatus.APPROVED &&
    status !== MembershipStatus.REJECTED
  ) {
    throw new Error("无效的操作状态");
  }

  const membership = await findMembership(memberId, clubId);
  if (!membership) {
    throw new Error("申请记录不存在");
  }

  if (membership.status !== MembershipStatus.PENDING) {
    throw new Error("该申请已处理");
  }

  return await updateMembershipStatus(
    memberId,
    clubId,
    status,
    status === MembershipStatus.APPROVED ? "MEMBER" : undefined
  );
};
export const getMembers = async (
  clubId: number,
  page: number,
  pageSize: number
) => {
  const club = await findClubById(clubId);
  if (!club) {
    throw new Error("社团不存在");
  }

  const skip = (page - 1) * pageSize;
  const take = pageSize;
  const { members, total } = await findClubMembers(clubId, skip, take);

  // 格式化数据
  let list = members.map((m) => ({
    ...m.user,
    joinedAt: formatDateTime(m.joinedAt),
    roleInClub: m.roleInClub,
  }));

  // 如果是第一页，且社长不在列表中（可能是因为 findClubMembers 没包含，或者社长尚未加入 clubMembership），手动添加
  // 但我们现在的逻辑是创建社团时会自动添加社长为 member。
  // 为了保险，如果社长不在列表中，我们手动检查一下。
  // 不过 findClubMembers 已经按 roleInClub 排序，LEADER 会在最前。
  // 如果数据库数据旧（社长没在 membership 表），这里可以补救：
  if (page === 1) {
    const leaderInList = list.find((m) => m.id === club.leaderId);
    if (!leaderInList) {
      // 检查社长是否在 membership 表中
      const membership = await findMembership(club.leaderId, clubId);
      if (!membership) {
        // 如果不在，手动添加社长到列表顶部（仅显示用，不插入数据库）
        const leader = club.leader;
        if (leader) {
          list.unshift({
            id: leader.id,
            username: leader.username,
            realName: leader.realName,
            avatar: leader.avatar,
            studentId: (leader as any).studentId, // 兼容类型
            joinedAt: formatDateTime(club.createdAt), // 假设创建时间即加入时间
            roleInClub: "LEADER",
          });
          // 注意：total 并没有增加，这可能会导致分页的小问题，但通常可以接受
        }
      }
    }
  }

  return {
    list,
    total:
      total +
      (page === 1 &&
      !list.find((m) => m.id === club.leaderId && m.roleInClub === "LEADER")
        ? 1
        : 0), // 修正 total (仅做参考)
    page,
    pageSize,
  };
};
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
  const formattedClubs = clubs.map((club) => ({
    ...club,
    createdAt: formatDateTime(club.createdAt),
    updatedAt: formatDateTime(club.updatedAt),
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

  // 如果审批通过，将申请人的角色提升为 LEADER（如果当前是普通用户），并加入社团成员列表
  if (status === Status.APPROVED) {
    const leader = club.leader;
    if (leader.role === Role.USER) {
      await updateUser(leader.id, { role: Role.LEADER });
    }
    // 将负责人添加为社团成员 (角色: LEADER)
    // 检查是否已经是成员
    const membership = await findMembership(leader.id, clubId);
    if (!membership) {
      // createMembership 默认状态是 PENDING，这里需要直接设为 APPROVED 并指定角色
      // 由于 createMembership 比较简单，我们可以直接调用 repository 的 create 方法，或者扩展 createMembership
      // 这里为了方便，我们直接调用 createMembership 然后更新，或者修改 repository
      // 更好的方式是 update createMembership to accept data
      // 既然我们有 updateMembershipStatus 的需求，不如先添加 updateMembershipStatus 的 repository 方法
      // 暂时先用 prisma.clubMembership.create 直接在 repository 增加一个专用方法，或者复用 createMembership 但需要修改
      // 让我们在 repository 增加 createLeaderMembership
      await createLeaderMembership(leader.id, clubId);
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
  const formattedClubs = clubs.map((club) => ({
    ...club,
    createdAt: formatDateTime(club.createdAt),
    updatedAt: formatDateTime(club.updatedAt),
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
  const formattedClubs = clubs.map((club) => ({
    ...club,
    createdAt: formatDateTime(club.createdAt),
    updatedAt: formatDateTime(club.updatedAt),
  }));

  return formattedClubs;
};

export const getUserLedClubs = async (userId: number) => {
  const clubs = await findClubsByLeaderId(userId);

  // 格式化时间
  const formattedClubs = clubs.map((club) => ({
    ...club,
    createdAt: formatDateTime(club.createdAt),
    updatedAt: formatDateTime(club.updatedAt),
  }));

  return formattedClubs;
};

export const getUserJoinedClubs = async (
  userId: number,
  page: number,
  pageSize: number
) => {
  const skip = (page - 1) * pageSize;
  const take = pageSize;
  const { clubs, total } = await findClubsByMemberId(userId, skip, take);

  // 格式化时间
  const list = clubs.map((club) => ({
    ...club,
    createdAt: formatDateTime(club.createdAt),
    updatedAt: formatDateTime(club.updatedAt),
  }));

  return {
    list,
    total,
    page,
    pageSize,
  };
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
