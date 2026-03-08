
import { Role } from "@prisma/client";
import { countPendingClubs, countPendingMembershipsByLeader } from "../repositories/club.repository";
import { countPendingActivities, countPendingEnrollmentsByLeader } from "../repositories/activity.repository";

export const getPendingCounts = async (userId: number, role: Role) => {
  const result = {
    admin: {
      pendingClubs: 0,
      pendingActivities: 0,
    },
    leader: {
      pendingJoinApplications: 0,
      pendingActivityEnrollments: 0,
    },
  };

  if (role === Role.ADMIN) {
    result.admin.pendingClubs = await countPendingClubs();
    result.admin.pendingActivities = await countPendingActivities();
  }

  if (role === Role.LEADER) {
    result.leader.pendingJoinApplications = await countPendingMembershipsByLeader(userId);
    result.leader.pendingActivityEnrollments = await countPendingEnrollmentsByLeader(userId);
  }

  return result;
};
