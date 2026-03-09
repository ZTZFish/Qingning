import {
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  findAnnouncementById,
  findAllAnnouncements,
  findPersonalMessages,
  markPersonalMessageRead,
} from "../repositories/announcement.repository";
import { findUserById } from "../repositories/user.repository";
import { formatDateTime } from "../utils/date";
import { Role } from "@prisma/client";

export const publishAnnouncement = async (
  authorId: number,
  data: {
    title: string;
    content: string;
    pinned?: boolean;
  }
) => {
  const user = await findUserById(authorId);
  if (!user) throw new Error("用户不存在");

  // 系统公告，只有管理员可以发布
  if (user.role !== "ADMIN") {
    throw new Error("只有管理员可以发布系统公告");
  }

  // 实际上应该校验社团是否存在及权限

  return await createAnnouncement({
    ...data,
    authorId,
    targetId: 0,
    isRead: false,
  });
};

export const createPersonalMessage = async (data: {
  targetId: number;
  title: string;
  content: string;
  authorId?: number;
}) => {
  return await createAnnouncement({
    title: data.title,
    content: data.content,
    authorId: data.authorId,
    pinned: false,
    targetId: data.targetId,
    isRead: false,
  });
};

export const editAnnouncement = async (
  operatorId: number,
  id: number,
  data: Partial<{
    title: string;
    content: string;
    pinned: boolean;
  }>
) => {
  const announcement = await findAnnouncementById(id);
  if (!announcement) throw new Error("公告不存在");
  if ((announcement as any).targetId !== 0) {
    throw new Error("个人消息不支持编辑");
  }

  const operator = await findUserById(operatorId);
  if (!operator) throw new Error("用户不存在");

  // 权限检查

  // 系统公告，仅管理员可编辑
  if (operator.role !== "ADMIN") {
    throw new Error("无权编辑系统公告");
  }

  // 社团公告，管理员或该社团负责人可编辑
  // 此处简化，假设管理员有所有权限，或者 authorId === operatorId
  if (operator.role !== "ADMIN" && announcement.authorId !== operatorId) {
    throw new Error("无权编辑该公告");
  }

  return await updateAnnouncement(id, data);
};

export const removeAnnouncement = async (operatorId: number, id: number) => {
  const announcement = await findAnnouncementById(id);
  if (!announcement) throw new Error("公告不存在");
  if ((announcement as any).targetId !== 0) {
    throw new Error("个人消息不支持删除");
  }

  const operator = await findUserById(operatorId);
  if (!operator) throw new Error("用户不存在");

  {
    if (operator.role !== "ADMIN" && announcement.authorId !== operatorId) {
      throw new Error("无权删除该公告");
    }
  }

  return await deleteAnnouncement(id);
};

export const getAnnouncementList = async (
  page: number,
  pageSize: number,
  search?: string
) => {
  const skip = (page - 1) * pageSize;
  const take = pageSize;
  const { announcements, total } = await findAllAnnouncements(
    skip,
    take,
    search
  );

  const list = announcements.map((a) => ({
    ...a,
    createdAt: formatDateTime(a.createdAt),
    updatedAt: formatDateTime(a.updatedAt),
  }));

  return { list, total, page, pageSize };
};

export const getPersonalMessageList = async (
  userId: number,
  page: number,
  pageSize: number,
  search?: string
) => {
  const skip = (page - 1) * pageSize;
  const take = pageSize;
  const { messages, total } = await findPersonalMessages(
    userId,
    skip,
    take,
    search
  );

  const list = messages.map((a) => ({
    ...a,
    createdAt: formatDateTime(a.createdAt),
    updatedAt: formatDateTime(a.updatedAt),
  }));

  return { list, total, page, pageSize };
};

export const markMyMessageRead = async (userId: number, id: number) => {
  const updated = await markPersonalMessageRead(id, userId);
  if (updated === 0) {
    throw new Error("消息不存在或无权限操作");
  }
  return true;
};

export const getAnnouncementDetail = async (
  operatorId: number,
  operatorRole: Role,
  id: number
) => {
  const announcement = await findAnnouncementById(id);
  if (!announcement) throw new Error("公告不存在");

  const targetId = (announcement as any).targetId as number | undefined;
  if (targetId && targetId !== 0) {
    if (operatorRole !== Role.ADMIN && operatorId !== targetId) {
      throw new Error("无权查看该消息");
    }
  }

  return {
    ...announcement,
    createdAt: formatDateTime(announcement.createdAt),
    updatedAt: formatDateTime(announcement.updatedAt),
  };
};
