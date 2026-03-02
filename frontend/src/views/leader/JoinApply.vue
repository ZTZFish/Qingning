<template>
  <div class="join-apply-container">
    <div class="page-header">
      <h2 class="page-title">入社申请管理</h2>
      <el-select
        v-model="currentClubId"
        placeholder="选择社团"
        @change="handleClubChange"
        style="width: 240px"
      >
        <el-option
          v-for="club in myClubs"
          :key="club.id"
          :label="club.name"
          :value="club.id"
        />
      </el-select>
    </div>

    <div v-if="currentClubId" class="application-list">
      <el-card shadow="never">
        <el-table
          :data="applications"
          style="width: 100%"
          v-loading="loading"
          empty-text="暂无待审核申请"
        >
          <el-table-column label="申请人" width="200">
            <template #default="{ row }">
              <div class="user-info">
                <el-avatar :size="32" :src="getAvatarUrl(row.avatar)" />
                <span class="username">{{ row.realName || row.username }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="studentId" label="学号" width="150" />
          <el-table-column prop="joinedAt" label="申请时间" width="180" />
          <el-table-column prop="notes" label="申请理由" min-width="200" />
          <el-table-column label="操作" width="180" fixed="right">
            <template #default="{ row }">
              <el-button
                type="success"
                size="small"
                @click="handleAudit(row, 'APPROVED')"
              >
                通过
              </el-button>
              <el-button
                type="danger"
                size="small"
                @click="handleAudit(row, 'REJECTED')"
              >
                拒绝
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <div class="pagination-wrapper" v-if="total > 0">
          <el-pagination
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :total="total"
            layout="total, prev, pager, next"
            @current-change="fetchApplications"
          />
        </div>
      </el-card>
    </div>
    <div v-else-if="myClubs.length > 0" class="empty-state">
      <el-empty description="请选择要管理的社团" />
    </div>
    <div v-else class="empty-state">
      <el-empty description="您当前没有管理的社团" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useUserStore } from "@/stores/user";
import { ElMessage, ElMessageBox } from "element-plus";
import {
  getUserLedClubs,
  getClubApplications,
  auditClubApplication,
} from "@/api/club";
import type { Club } from "@/types";

const userStore = useUserStore();
const myClubs = ref<Club[]>([]);
const currentClubId = ref<number | undefined>(undefined);
const applications = ref<any[]>([]);
const loading = ref(false);
const total = ref(0);
const currentPage = ref(1);
const pageSize = ref(10);

const BASE_URL = import.meta.env.VITE_API_BASE_URL.replace(/\/api\/?$/, "");

const getAvatarUrl = (path?: string) => {
  if (!path)
    return "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png";
  if (path.startsWith("http")) return path;
  return `${BASE_URL}${path}`;
};

const fetchMyClubs = async () => {
  if (!userStore.user?.id) return;
  try {
    const res = await getUserLedClubs(userStore.user.id);
    myClubs.value = res || [];
    if (myClubs.value.length > 0 && myClubs.value[0]) {
      currentClubId.value = myClubs.value[0].id;
      fetchApplications();
    }
  } catch (error: any) {
    ElMessage.error(error.message || "获取负责社团失败");
  }
};

const fetchApplications = async () => {
  if (!currentClubId.value) return;
  loading.value = true;
  try {
    const res = await getClubApplications(currentClubId.value, {
      page: currentPage.value,
      pageSize: pageSize.value,
    });
    applications.value = res.list;
    total.value = res.total;
  } catch (error: any) {
    ElMessage.error(error.message || "获取申请列表失败");
  } finally {
    loading.value = false;
  }
};

const handleClubChange = () => {
  currentPage.value = 1;
  fetchApplications();
};

const handleAudit = (row: any, status: "APPROVED" | "REJECTED") => {
  if (!currentClubId.value) return;

  const actionText = status === "APPROVED" ? "通过" : "拒绝";
  ElMessageBox.confirm(
    `确定要${actionText}用户 "${row.realName || row.username}" 的入社申请吗？`,
    "提示",
    {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: status === "APPROVED" ? "success" : "warning",
    }
  )
    .then(async () => {
      try {
        await auditClubApplication(currentClubId.value!, row.id, status);
        ElMessage.success(`已${actionText}`);
        fetchApplications();
      } catch (error: any) {
        ElMessage.error(error.message || "操作失败");
      }
    })
    .catch(() => { });
};

onMounted(() => {
  fetchMyClubs();
});
</script>

<style scoped>
.join-apply-container {
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

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.username {
  font-weight: 500;
}

.pagination-wrapper {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.empty-state {
  display: flex;
  justify-content: center;
  padding: 40px 0;
}
</style>