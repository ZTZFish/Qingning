import prisma from "../prisma/client";
import { ActivityStatus, Status } from "@prisma/client";
import { formatDateTime } from "../utils/date";

const normalizeText = (s: string) => s.toLowerCase();

const scoreByTags = (
  tags: string[],
  fields: Array<{ text: string; weight: number }>
) => {
  if (tags.length === 0) return 0;
  let score = 0;
  for (const tag of tags) {
    const key = normalizeText(tag);
    if (!key) continue;
    for (const f of fields) {
      if (normalizeText(f.text).includes(key)) score += f.weight;
    }
  }
  return score;
};

const deriveActivityStatus = (
  status: ActivityStatus,
  date: Date,
  endAt: Date
) => {
  if (status === ActivityStatus.APPROVED) {
    const now = new Date();
    if (now >= endAt) return ActivityStatus.FINISHED;
    if (now >= date) return ActivityStatus.ONGOING;
    return ActivityStatus.APPROVED;
  }
  return status;
};

const clubTypeKeywords: Record<string, string[]> = {
  ACADEMIC: ["学术", "竞赛", "讲座", "科研", "学习"],
  SPORTS: ["体育", "运动", "篮球", "足球", "羽毛球", "跑步", "健身"],
  ARTS: ["文艺", "音乐", "舞蹈", "摄影", "绘画", "戏剧"],
  VOLUNTEER: ["志愿", "公益", "支教", "服务"],
  TECH: ["科技", "编程", "算法", "AI", "机器人", "开发", "技术"],
  ENTERTAINMENT: ["娱乐", "桌游", "电竞", "游戏", "社交"],
  OTHER: [],
};

const matchClubTypeBoost = (tags: string[], clubType: string) => {
  const keys = clubTypeKeywords[clubType] || [];
  if (tags.length === 0 || keys.length === 0) return 0;
  const tagSet = new Set(tags.map((t) => normalizeText(t)));
  for (const k of keys) {
    if (tagSet.has(normalizeText(k))) return 6;
  }
  return 0;
};

export const getPersonalizedRecommendations = async (
  userId: number,
  limits: { clubs: number; activities: number } = { clubs: 6, activities: 6 }
) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, tags: true },
  });
  const tags = Array.isArray((user as any)?.tags)
    ? ((user as any).tags as string[])
    : [];

  const clubsRaw = await prisma.club.findMany({
    where: { isDeleted: false, status: Status.APPROVED },
    select: {
      id: true,
      name: true,
      type: true,
      description: true,
      coverImage: true,
      createdAt: true,
      leader: { select: { id: true, realName: true, username: true } },
      _count: { select: { members: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  const activitiesRaw = await prisma.activity.findMany({
    where: {
      isDeleted: false,
      status: ActivityStatus.APPROVED,
      endAt: { gt: new Date() },
      club: { isDeleted: false, status: Status.APPROVED },
    },
    select: {
      id: true,
      clubId: true,
      name: true,
      description: true,
      coverImage: true,
      date: true,
      endAt: true,
      location: true,
      status: true,
      createdAt: true,
      club: { select: { id: true, name: true, type: true } },
    },
    orderBy: { date: "desc" },
    take: 200,
  });

  const clubsScored = clubsRaw
    .map((c) => {
      const base = matchClubTypeBoost(tags, c.type);
      const tagScore = scoreByTags(tags, [
        { text: c.name, weight: 5 },
        { text: c.description || "", weight: 2 },
      ]);
      const pop = Math.min(10, Math.log1p(c._count.members) * 2);
      return { club: c, score: base + tagScore + pop };
    })
    .sort((a, b) => b.score - a.score);

  const activitiesScored = activitiesRaw
    .map((a) => {
      const derived = deriveActivityStatus(a.status, a.date, a.endAt);
      const tagScore = scoreByTags(tags, [
        { text: a.name, weight: 5 },
        { text: a.description || "", weight: 2 },
        { text: a.club?.name || "", weight: 1 },
      ]);
      const typeBoost = a.club ? matchClubTypeBoost(tags, a.club.type) : 0;
      const timeBoost =
        derived === ActivityStatus.ONGOING
          ? 3
          : derived === ActivityStatus.APPROVED
          ? 1
          : 0;
      return {
        activity: { ...a, status: derived },
        score: tagScore + typeBoost + timeBoost,
      };
    })
    .sort((a, b) => b.score - a.score);

  const fallbackClubs = clubsRaw
    .slice()
    .sort((a, b) => (b._count.members || 0) - (a._count.members || 0));
  const fallbackActivities = activitiesRaw
    .slice()
    .sort((a, b) => b.date.getTime() - a.date.getTime());

  const clubsPicked =
    tags.length > 0 ? clubsScored.map((x) => x.club) : fallbackClubs;
  const activitiesPicked =
    tags.length > 0
      ? activitiesScored.map((x) => x.activity)
      : fallbackActivities.map((x) => ({
          ...x,
          status: deriveActivityStatus(x.status, x.date, x.endAt),
        }));

  const clubs = clubsPicked.slice(0, limits.clubs).map((c) => ({
    ...c,
    createdAt: formatDateTime(c.createdAt),
  }));

  const activities = activitiesPicked.slice(0, limits.activities).map((a) => ({
    ...a,
    date: formatDateTime(a.date),
    endAt: formatDateTime(a.endAt),
    createdAt: formatDateTime(a.createdAt),
  }));

  return {
    tags,
    clubs,
    activities,
  };
};
