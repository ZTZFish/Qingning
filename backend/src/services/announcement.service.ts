import {
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  findAnnouncementById,
  findAllAnnouncements,
} from "../repositories/announcement.repository";
import { findUserById } from "../repositories/user.repository";
import { formatDateTime } from "../utils/date";

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

export const getAnnouncementDetail = async (id: number) => {
  const announcement = await findAnnouncementById(id);
  if (!announcement) throw new Error("公告不存在");

  return {
    ...announcement,
    createdAt: formatDateTime(announcement.createdAt),
    updatedAt: formatDateTime(announcement.updatedAt),
  };
};
