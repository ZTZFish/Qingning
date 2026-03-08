
import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { getPendingCounts, type PendingCounts } from "@/api/notification";
import { useUserStore } from "./user";

export const useNotificationStore = defineStore("notification", () => {
  const counts = ref<PendingCounts>({
    admin: {
      pendingClubs: 0,
      pendingActivities: 0,
    },
    leader: {
      pendingJoinApplications: 0,
      pendingActivityEnrollments: 0,
    },
  });

  const userStore = useUserStore();

  const fetchCounts = async () => {
    if (!userStore.user) return;
    try {
      const res = await getPendingCounts();
      // @ts-ignore: res.data might be wrapped or not depending on request util
      counts.value = res; 
    } catch (error) {
      console.error("Failed to fetch notification counts", error);
    }
  };

  const adminTotal = computed(() => {
    return counts.value.admin.pendingClubs + counts.value.admin.pendingActivities;
  });

  const leaderTotal = computed(() => {
    return (
      counts.value.leader.pendingJoinApplications +
      counts.value.leader.pendingActivityEnrollments
    );
  });

  return {
    counts,
    fetchCounts,
    adminTotal,
    leaderTotal,
  };
});
