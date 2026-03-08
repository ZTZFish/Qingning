
import request from "@/utils/request";

export interface PendingCounts {
  admin: {
    pendingClubs: number;
    pendingActivities: number;
  };
  leader: {
    pendingJoinApplications: number;
    pendingActivityEnrollments: number;
  };
}

export const getPendingCounts = () => {
  return request.get<PendingCounts>("/notifications/counts");
};
