<template>
  <div class="club-list-container">
    <div class="page-header">
      <h2 class="page-title">{{ pageTitle }}</h2>
      <el-input
        v-if="mode === 'discover'"
        v-model="searchQuery"
        placeholder="搜索社团..."
        prefix-icon="Search"
        style="width: 300px"
        clearable
        @input="handleSearch"
      />
    </div>

    <div v-loading="loading" class="club-grid">
      <div v-if="clubs.length === 0 && !loading" class="empty-state">
        <el-empty :description="emptyText" />
      </div>

      <ClubCard
        v-for="club in clubs"
        :key="club.id"
        :club="club"
        @click="handleClubClick"
      />
    </div>

    <div v-if="total > 0" class="pagination-container">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :total="total"
        :page-sizes="[12, 24, 36]"
        layout="total, sizes, prev, pager, next"
        @size-change="handleSizeChange"
        @current-change="handlePageChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { Search } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import ClubCard from "@/components/ClubCard.vue";
import { useUserStore } from "@/stores/user";
import { getClubs, getUserJoinedClubs, getUserLedClubs } from "@/api/club";
import type { Club } from "@/types";

const props = defineProps<{
  mode: "discover" | "joined" | "managed";
}>();

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();

const clubs = ref<Club[]>([]);
const loading = ref(false);
const total = ref(0);
const currentPage = ref(1);
const pageSize = ref(12);
const searchQuery = ref("");

const pageTitle = computed(() => {
  switch (props.mode) {
    case "discover":
      return "发现社团";
    case "joined":
      return "我的社团";
    case "managed":
      return "社团管理";
    default:
      return "社团列表";
  }
});

const emptyText = computed(() => {
  switch (props.mode) {
    case "discover":
      return "暂无社团";
    case "joined":
      return "您尚未加入任何社团";
    case "managed":
      return "您当前没有管理的社团";
    default:
      return "暂无数据";
  }
});

const fetchData = async () => {
  loading.value = true;
  try {
    if (props.mode === "discover") {
      const res = await getClubs({
        page: currentPage.value,
        pageSize: pageSize.value,
        search: searchQuery.value,
      });
      clubs.value = res.list;
      total.value = res.total;
    } else if (props.mode === "joined") {
      if (!userStore.user?.id) return;
      const res = await getUserJoinedClubs(userStore.user.id, {
        page: currentPage.value,
        pageSize: pageSize.value,
      });
      clubs.value = res.list;
      total.value = res.total;
    } else if (props.mode === "managed") {
      if (!userStore.user?.id) return;
      // Note: managed API currently returns all (no pagination params in backend yet for this specific endpoint, 
      // but we can slice it client side or update backend later if needed. 
      // The current backend implementation for getUserLedClubs returns Array<Club>, not {list, total})
      // However, usually a user manages very few clubs, so client-side pagination is fine or just show all.
      // Let's assume it returns an array for now based on previous code.
      const res = await getUserLedClubs(userStore.user.id);
      // Client-side pagination for managed clubs if needed, or just show all
      clubs.value = res; 
      total.value = res.length;
    }
  } catch (error: any) {
    ElMessage.error(error.message || "获取社团列表失败");
  } finally {
    loading.value = false;
  }
};

const handleSearch = () => {
  currentPage.value = 1;
  fetchData();
};

const handlePageChange = (page: number) => {
  currentPage.value = page;
  fetchData();
};

const handleSizeChange = (size: number) => {
  pageSize.value = size;
  currentPage.value = 1;
  fetchData();
};

const handleClubClick = (club: Club) => {
  if (props.mode === "managed") {
    // Go to management dashboard for this club
    // For now, maybe just go to detail, or if you have a specific management page
    // The user said "Club Management... reuse interface... display different club card lists"
    // Assuming clicking leads to detail page where they can manage? 
    // Or maybe we should navigate to `/leader/club/:id` ?
    // Let's stick to club detail for now, or assume there is a manage route.
    // If I look at the previous sidebar, it had `/leader/club`. 
    // If I change `/leader/club` to use THIS component, clicking a card should probably go to specific management.
    // But we don't have a specific management page yet other than the list itself?
    // Let's just go to detail for now.
    router.push(`/clubs/${club.id}`);
  } else {
    router.push(`/clubs/${club.id}`);
  }
};

onMounted(() => {
  fetchData();
});

// Watch for mode changes (though usually route component is re-mounted)
watch(() => props.mode, () => {
  currentPage.value = 1;
  searchQuery.value = "";
  fetchData();
});
</script>

<style scoped>
.club-list-container {
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.page-title {
  font-size: 24px;
  font-weight: 600;
  color: #303133;
  margin: 0;
}

.club-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
  min-height: 200px;
}

.pagination-container {
  margin-top: 40px;
  display: flex;
  justify-content: center;
}

.empty-state {
  grid-column: 1 / -1;
  display: flex;
  justify-content: center;
  padding: 40px 0;
}
</style>