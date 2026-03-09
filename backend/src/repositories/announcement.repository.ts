import prisma from "../prisma/client";

export const createAnnouncement = async (data: {
  title: string;
  content: string;
  authorId?: number;
  pinned?: boolean;
  targetId?: number;
  isRead?: boolean;
}) => {
  return await prisma.announcement.create({
    data: {
      title: data.title,
      content: data.content,
      authorId: data.authorId ?? null,
      pinned: data.pinned ?? false,
      targetId: data.targetId ?? 0,
      isRead: data.isRead ?? false,
    },
  });
};

export const updateAnnouncement = async (
  id: number,
  data: Partial<{
    title: string;
    content: string;
    pinned: boolean;
  }>
) => {
  return await prisma.announcement.update({
    where: { id },
    data,
  });
};

export const deleteAnnouncement = async (id: number) => {
  return await prisma.announcement.delete({
    where: { id },
  });
};

export const findAnnouncementById = async (id: number) => {
  return await prisma.announcement.findUnique({
    where: { id },
    include: {
      author: {
        select: {
          id: true,
          username: true,
          realName: true,
          avatar: true,
        },
      },
    },
  });
};

export const findAllAnnouncements = async (
  skip: number,
  take: number,
  search?: string
) => {
  const where: any = { targetId: 0 };

  if (search) {
    where.title = { contains: search };
  }

  const [announcements, total] = await prisma.$transaction([
    prisma.announcement.findMany({
      where,
      include: {
        author: {
          select: {
            id: true,
            username: true,
            realName: true,
          },
        },
      },
      orderBy: [{ pinned: "desc" }, { createdAt: "desc" }],
      skip,
      take,
    }),
    prisma.announcement.count({ where }),
  ]);

  return { announcements, total };
};

export const findPersonalMessages = async (
  userId: number,
  skip: number,
  take: number,
  search?: string
) => {
  const where: any = { targetId: userId };

  if (search) {
    where.title = { contains: search };
  }

  const [messages, total] = await prisma.$transaction([
    prisma.announcement.findMany({
      where,
      include: {
        author: {
          select: {
            id: true,
            username: true,
            realName: true,
          },
        },
      },
      orderBy: [{ createdAt: "desc" }],
      skip,
      take,
    }),
    prisma.announcement.count({ where }),
  ]);

  return { messages, total };
};

export const markPersonalMessageRead = async (id: number, userId: number) => {
  const result = await prisma.announcement.updateMany({
    where: { id, targetId: userId },
    data: { isRead: true },
  });
  return result.count;
};

export const countUnreadPersonalMessages = async (userId: number) => {
  return await prisma.announcement.count({
    where: { targetId: userId, isRead: false },
  });
};
