import prisma from "../prisma/client";
import {
  ActivityStatus,
  MembershipStatus,
  ParticipationStatus,
  Status,
} from "@prisma/client";

const toLocalDateKey = (d: Date) => {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

const startOfDay = (d: Date) => {
  const next = new Date(d);
  next.setHours(0, 0, 0, 0);
  return next;
};

const buildDateRange = (days: number) => {
  const count = Math.max(1, Math.min(365, Math.floor(days)));
  const end = startOfDay(new Date());
  const start = new Date(end);
  start.setDate(start.getDate() - (count - 1));
  const dates: string[] = [];
  for (let i = 0; i < count; i += 1) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    dates.push(toLocalDateKey(d));
  }
  return { start, end, dates };
};

const buildDailySeries = (dates: string[], rows: Array<{ createdAt: Date }>) => {
  const map = new Map<string, number>();
  for (const d of dates) map.set(d, 0);
  for (const r of rows) {
    const key = toLocalDateKey(r.createdAt);
    if (map.has(key)) map.set(key, (map.get(key) || 0) + 1);
  }
  return dates.map((d) => map.get(d) || 0);
};

export const getAdminAnalyticsOverview = async (days: number) => {
  const { start, dates } = buildDateRange(days);

  const [
    totalUsers,
    totalClubs,
    approvedClubs,
    totalActivities,
    totalPublicAnnouncements,
    totalPersonalMessages,
    unreadPersonalMessages,
  ] = await Promise.all([
    prisma.user.count({ where: { isDeleted: false } }),
    prisma.club.count({ where: { isDeleted: false } }),
    prisma.club.count({ where: { isDeleted: false, status: Status.APPROVED } }),
    prisma.activity.count({ where: { isDeleted: false } }),
    prisma.announcement.count({ where: { targetId: 0 } }),
    prisma.announcement.count({ where: { targetId: { not: 0 } } }),
    prisma.announcement.count({ where: { targetId: { not: 0 }, isRead: false } }),
  ]);

  const [
    activitiesByStatusRaw,
    clubsByStatusRaw,
    clubsByTypeRaw,
    membershipsByStatusRaw,
    enrollmentsByStatusRaw,
  ] = await Promise.all([
    prisma.activity.groupBy({
      by: ["status"],
      where: { isDeleted: false },
      _count: { _all: true },
    }),
    prisma.club.groupBy({
      by: ["status"],
      where: { isDeleted: false },
      _count: { _all: true },
    }),
    prisma.club.groupBy({
      by: ["type"],
      where: { isDeleted: false },
      _count: { _all: true },
    }),
    prisma.clubMembership.groupBy({
      by: ["status"],
      _count: { _all: true },
    }),
    prisma.userActivity.groupBy({
      by: ["status"],
      _count: { _all: true },
    }),
  ]);

  const activitiesByStatus = Object.fromEntries(
    Object.values(ActivityStatus).map((s) => [s, 0])
  ) as Record<ActivityStatus, number>;
  for (const row of activitiesByStatusRaw) {
    activitiesByStatus[row.status] = row._count._all;
  }

  const clubsByStatus = Object.fromEntries(
    Object.values(Status).map((s) => [s, 0])
  ) as Record<Status, number>;
  for (const row of clubsByStatusRaw) {
    clubsByStatus[row.status] = row._count._all;
  }

  const clubsByType = Object.fromEntries(
    clubsByTypeRaw.map((r) => [r.type, r._count._all])
  ) as Record<string, number>;

  const membershipsByStatus = Object.fromEntries(
    Object.values(MembershipStatus).map((s) => [s, 0])
  ) as Record<MembershipStatus, number>;
  for (const row of membershipsByStatusRaw) {
    membershipsByStatus[row.status] = row._count._all;
  }

  const enrollmentsByStatus = Object.fromEntries(
    Object.values(ParticipationStatus).map((s) => [s, 0])
  ) as Record<ParticipationStatus, number>;
  for (const row of enrollmentsByStatusRaw) {
    enrollmentsByStatus[row.status] = row._count._all;
  }

  const [usersRecent, clubsRecent, activitiesRecent, messagesRecent] =
    await Promise.all([
      prisma.user.findMany({
        where: { isDeleted: false, createdAt: { gte: start } },
        select: { createdAt: true },
      }),
      prisma.club.findMany({
        where: { isDeleted: false, createdAt: { gte: start } },
        select: { createdAt: true },
      }),
      prisma.activity.findMany({
        where: { isDeleted: false, createdAt: { gte: start } },
        select: { createdAt: true },
      }),
      prisma.announcement.findMany({
        where: { targetId: { not: 0 }, createdAt: { gte: start } },
        select: { createdAt: true },
      }),
    ]);

  const timeSeries = {
    dates,
    users: buildDailySeries(dates, usersRecent),
    clubs: buildDailySeries(dates, clubsRecent),
    activities: buildDailySeries(dates, activitiesRecent),
    personalMessages: buildDailySeries(dates, messagesRecent),
  };

  const topMemberships = await prisma.clubMembership.groupBy({
    by: ["clubId"],
    where: { status: MembershipStatus.APPROVED },
    _count: { clubId: true },
    orderBy: { _count: { clubId: "desc" } },
    take: 8,
  });
  const topClubIds = topMemberships.map((m) => m.clubId);
  const clubs = await prisma.club.findMany({
    where: { id: { in: topClubIds } },
    select: { id: true, name: true, type: true, status: true, leaderId: true },
  });
  const clubMap = new Map(clubs.map((c) => [c.id, c]));
  const topClubsByMembers = topMemberships
    .map((m) => ({
      clubId: m.clubId,
      name: clubMap.get(m.clubId)?.name || `#${m.clubId}`,
      type: clubMap.get(m.clubId)?.type || "UNKNOWN",
      status: clubMap.get(m.clubId)?.status || Status.PENDING,
      approvedMembers: m._count.clubId,
    }))
    .filter((x) => x.status === Status.APPROVED);

  return {
    totals: {
      users: totalUsers,
      clubs: totalClubs,
      clubsApproved: approvedClubs,
      activities: totalActivities,
      announcementsPublic: totalPublicAnnouncements,
      messagesPersonal: totalPersonalMessages,
      messagesUnread: unreadPersonalMessages,
    },
    breakdown: {
      activitiesByStatus,
      clubsByStatus,
      clubsByType,
      membershipsByStatus,
      enrollmentsByStatus,
    },
    timeSeries,
    topClubsByMembers,
  };
};
