<template>
  <div class="content-audit">
    <el-tabs v-model="activeTab" class="audit-tabs">
      <!-- 社团创建审批 -->
      <el-tab-pane label="社团申请审批" name="clubs">
        <CommonList
          title="待审批社团"
          :data="pendingClubs"
          :columns="clubColumns"
          :total="pendingClubsTotal"
          action-width="200"
          @page-change="handleClubPageChange"
        >
          <template #actions="{ row }">
            <el-button type="success" link @click="handleApproveClub(row)"
              >通过</el-button
            >
            <el-button type="danger" link @click="handleRejectClub(row)"
              >拒绝</el-button
            >
            <el-button type="info" link @click="handleViewClub(row)"
              >详情</el-button
            >
          </template>
        </CommonList>
      </el-tab-pane>

      <!-- 活动发布审批 -->
      <el-tab-pane label="活动申请审批" name="activities">
        <CommonList
          title="待审批活动"
          :data="pendingActivities"
          :columns="activityColumns"
          :total="pendingActivitiesTotal"
          action-width="200"
          :current-page="pendingActivitiesPage"
          :page-size="pendingActivitiesPageSize"
          @page-change="handleActivityPageChange"
        >
          <template #actions="{ row }">
            <el-button type="success" link @click="handleApproveActivity(row)"
              >通过</el-button
            >
            <el-button type="danger" link @click="handleRejectActivity(row)"
              >拒绝</el-button
            >
            <el-button type="info" link @click="handleViewActivity(row)"
              >详情</el-button
            >
          </template>
        </CommonList>
      </el-tab-pane>
    </el-tabs>

    <!-- 社团详情弹窗 -->
    <el-dialog v-model="clubDetailVisible" title="社团申请详情" width="700px">
      <div v-if="currentClub" class="detail-container">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="社团名称">{{
            currentClub.name
          }}</el-descriptions-item>
          <el-descriptions-item label="社团类型">
            <el-tag>{{ currentClub.type }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="申请人">{{
            currentClub.leader?.realName
          }}</el-descriptions-item>
          <el-descriptions-item label="申请时间">{{
            currentClub.createdAt
          }}</el-descriptions-item>
          <el-descriptions-item label="社团简介" :span="2">{{
            currentClub.description
          }}</el-descriptions-item>
          <el-descriptions-item label="社团封面" :span="2">
            <el-image
              v-if="currentClub.coverImage"
              :src="getFullUrl(currentClub.coverImage)"
              fit="cover"
              class="detail-image"
              :preview-src-list="[getFullUrl(currentClub.coverImage)]"
            />
            <span v-else>未上传</span>
          </el-descriptions-item>
          <el-descriptions-item label="手续材料 (盖章)" :span="2">
            <el-image
              v-if="currentClub.materials"
              :src="getFullUrl(currentClub.materials)"
              fit="cover"
              class="detail-image"
              :preview-src-list="[getFullUrl(currentClub.materials)]"
            />
            <div v-else class="empty-tip">未上传手续照片</div>
          </el-descriptions-item>
        </el-descriptions>
      </div>
    </el-dialog>

    <!-- 活动详情弹窗 -->
    <el-dialog
      v-model="activityDetailVisible"
      title="活动申请详情"
      width="700px"
    >
      <div v-if="currentActivity" class="detail-container">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="活动名称">{{
            currentActivity.name
          }}</el-descriptions-item>
          <el-descriptions-item label="所属社团">{{
            currentActivity.club?.name
          }}</el-descriptions-item>
          <el-descriptions-item label="开始时间">{{
            currentActivity.date
          }}</el-descriptions-item>
          <el-descriptions-item label="结束时间">{{
            currentActivity.endAt
          }}</el-descriptions-item>
          <el-descriptions-item label="活动地点">{{
            currentActivity.location || "未填写"
          }}</el-descriptions-item>
          <el-descriptions-item label="发布人">{{
            currentActivity.leaderName
          }}</el-descriptions-item>
          <el-descriptions-item label="活动简介" :span="2">{{
            currentActivity.description
          }}</el-descriptions-item>
          <el-descriptions-item label="活动封面" :span="2">
            <el-image
              v-if="currentActivity.coverImage"
              :src="getFullUrl(currentActivity.coverImage)"
              fit="cover"
              class="detail-image"
              :preview-src-list="[getFullUrl(currentActivity.coverImage)]"
            />
            <span v-else>未上传</span>
          </el-descriptions-item>
        </el-descriptions>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import CommonList from "@/components/CommonList.vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { Status, ActivityStatus, ClubType, type Column } from "@/types";
import { getPendingClubs, auditClub } from "@/api/club";
import { getPendingActivities, auditActivity } from "@/api/activity";

const activeTab = ref("clubs");
const loading = ref(false);

// 详情弹窗状态
const clubDetailVisible = ref(false);
const currentClub = ref<any>(null);
const activityDetailVisible = ref(false);
const currentActivity = ref<any>(null);

const BASE_URL = import.meta.env.VITE_API_BASE_URL.replace(/\/api\/?$/, "");

const getFullUrl = (path: string) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${BASE_URL}${path}`;
};

const clubColumns: Column[] = [
  { label: "封面", prop: "coverImage", type: "image", width: "120" },
  { label: "社团名称", prop: "name", minWidth: "120" },
  {
    label: "类型",
    prop: "type",
    type: "tag",
    width: "120",
    tagMap: {
      [ClubType.ACADEMIC]: { label: "学术类", type: "primary" },
      [ClubType.SPORTS]: { label: "体育类", type: "success" },
      [ClubType.ARTS]: { label: "文艺类", type: "warning" },
      [ClubType.VOLUNTEER]: { label: "志愿公益类", type: "danger" },
      [ClubType.TECH]: { label: "科技类", type: "info" },
      [ClubType.ENTERTAINMENT]: { label: "娱乐类", type: "success" },
      [ClubType.OTHER]: { label: "其他", type: "info" },
    },
  },
  { label: "申请人", prop: "leader.realName", width: "100" },
  { label: "申请时间", prop: "createdAt", width: "120" },
];

const activityColumns: Column[] = [
  { label: "封面", prop: "coverImage", type: "image", width: "120" },
  { label: "活动名称", prop: "name", minWidth: "150" },
  { label: "所属社团", prop: "club.name", minWidth: "120" },
  { label: "开始时间", prop: "date", width: "160" },
  { label: "发布人", prop: "leaderName", width: "100" },
  { label: "申请时间", prop: "createdAt", width: "120" },
];

// 待审批社团数据
const pendingClubs = ref<any[]>([]);
const pendingClubsTotal = ref(0);
const pendingClubsPage = ref(1);
const pendingClubsPageSize = ref(10);

// 待审批活动数据
const pendingActivities = ref<any[]>([]);
const pendingActivitiesTotal = ref(0);
const pendingActivitiesPage = ref(1);
const pendingActivitiesPageSize = ref(10);

const fetchClubs = async () => {
  loading.value = true;
  try {
    const data = await getPendingClubs({
      page: pendingClubsPage.value,
      pageSize: pendingClubsPageSize.value,
    });
    pendingClubs.value = data.list;
    pendingClubsTotal.value = data.total;
  } catch (error: any) {
    ElMessage.error(error.message || "获取社团审批列表失败");
  } finally {
    loading.value = false;
  }
};

const fetchActivities = async () => {
  loading.value = true;
  try {
    const data = await getPendingActivities({
      page: pendingActivitiesPage.value,
      pageSize: pendingActivitiesPageSize.value,
    });
    pendingActivities.value = data.list;
    pendingActivitiesTotal.value = data.total;
  } catch (error: any) {
    ElMessage.error(error.message || "获取活动审批列表失败");
  } finally {
    loading.value = false;
  }
};

const fetchAuditData = async () => {
  await Promise.all([fetchClubs(), fetchActivities()]);
};

const handleClubPageChange = (page: number) => {
  pendingClubsPage.value = page;
  fetchClubs();
};

const handleActivityPageChange = (page: number) => {
  pendingActivitiesPage.value = page;
  fetchActivities();
};

onMounted(() => {
  fetchAuditData();
});

const handleApproveClub = (row: any) => {
  ElMessageBox.confirm(
    `确定要通过社团 ${row.name} 的创建申请吗？`,
    "审批提示",
    { type: "success" }
  )
    .then(async () => {
      try {
        await auditClub(row.id, { status: Status.APPROVED });
        ElMessage.success("审批通过");
        fetchClubs();
      } catch (error: any) {
        ElMessage.error(error.message || "操作失败");
      }
    })
    .catch(() => {});
};

const handleRejectClub = (row: any) => {
  ElMessageBox.prompt(`请输入拒绝社团 ${row.name} 的原因`, "审批提示", {
    type: "warning",
  })
    .then(async (data: any) => {
      try {
        await auditClub(row.id, {
          status: Status.REJECTED,
          reason: data.value,
        });
        ElMessage.warning(`已拒绝申请，原因: ${data.value}`);
        fetchClubs();
      } catch (error: any) {
        ElMessage.error(error.message || "操作失败");
      }
    })
    .catch(() => {});
};

const handleApproveActivity = (row: any) => {
  ElMessageBox.confirm(
    `确定要通过活动 ${row.name} 的发布申请吗？`,
    "审批提示",
    { type: "success" }
  )
    .then(async () => {
      try {
        await auditActivity(row.id, { status: ActivityStatus.APPROVED });
        ElMessage.success("审批通过");
        fetchActivities();
      } catch (error: any) {
        ElMessage.error(error.message || "操作失败");
      }
    })
    .catch(() => {});
};

const handleRejectActivity = (row: any) => {
  ElMessageBox.prompt(`请输入拒绝活动 ${row.name} 的原因`, "审批提示", {
    type: "warning",
  })
    .then(async (data: any) => {
      try {
        await auditActivity(row.id, {
          status: ActivityStatus.REJECTED,
          reason: data.value,
        });
        ElMessage.warning(`已拒绝申请，原因: ${data.value}`);
        fetchActivities();
      } catch (error: any) {
        ElMessage.error(error.message || "操作失败");
      }
    })
    .catch(() => {});
};

// ... existing view handlers
const handleViewClub = (row: any) => {
  currentClub.value = row;
  clubDetailVisible.value = true;
};

const handleViewActivity = (row: any) => {
  currentActivity.value = row;
  activityDetailVisible.value = true;
};
</script>

<style scoped>
.content-audit {
  background-color: #fff;
  padding: 24px;
  border-radius: 12px;
}

.audit-tabs :deep(.el-tabs__nav-wrap::after) {
  height: 1px;
}

.detail-image {
  width: 100%;
  max-height: 300px;
  border-radius: 8px;
  cursor: zoom-in;
}

.empty-tip {
  color: #909399;
  font-style: italic;
}
</style>
