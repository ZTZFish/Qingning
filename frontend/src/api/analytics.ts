import request from "@/utils/request";

export interface AdminAnalyticsOverview {
  totals: {
    users: number;
    clubs: number;
    clubsApproved: number;
    activities: number;
    announcementsPublic: number;
    messagesPersonal: number;
    messagesUnread: number;
  };
  breakdown: {
    activitiesByStatus: Record<string, number>;
    clubsByStatus: Record<string, number>;
    clubsByType: Record<string, number>;
    membershipsByStatus: Record<string, number>;
    enrollmentsByStatus: Record<string, number>;
  };
  timeSeries: {
    dates: string[];
    users: number[];
    clubs: number[];
    activities: number[];
    personalMessages: number[];
  };
  topClubsByMembers: Array<{
    clubId: number;
    name: string;
    type: string;
    status: string;
    approvedMembers: number;
  }>;
}

export const getAdminAnalyticsOverview = (params?: { days?: number }) => {
  return request.get<AdminAnalyticsOverview>("/admin/analytics/overview", {
    params,
  });
};

