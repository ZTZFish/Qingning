<template>
  <div class="activity-management">
    <CommonList
      title="活动管理"
      :data="activities"
      :columns="columns"
      :total="total"
      action-width="300"
      :current-page="currentPage"
      :page-size="pageSize"
      @page-change="handlePageChange"
    >
      <template #header-actions>
        <el-button
          v-if="userStore.user?.role === 'LEADER'"
          type="primary"
          @click="handlePublish"
          >发布活动</el-button
        >
        <el-input
          v-model="searchQuery"
          placeholder="搜索活动标题/所属社团"
          prefix-icon="Search"
          style="width: 240px; margin-left: 12px"
          clearable
          @input="handleSearch"
        />
      </template>

      <template #actions="{ row }">
        <!-- 负责人特有操作 -->
        <template v-if="userStore.user?.role === 'LEADER'">
          <el-button type="primary" link @click="handleEdit(row)"
            >编辑</el-button
          >
          <el-button type="success" link @click="handleRecruit(row)"
            >录取管理</el-button
          >
          <el-button type="danger" link @click="handleDelete(row)"
            >取消活动</el-button
          >
        </template>

        <!-- 管理员特有操作 -->
        <template v-else-if="userStore.user?.role === 'ADMIN'">
          <el-button type="warning" link @click="handleAudit(row)"
            >下架/整改</el-button
          >
          <el-button type="danger" link @click="handleDelete(row)"
            >强行删除</el-button
          >
        </template>

        <el-button type="info" link @click="handleViewDetail(row)"
          >详情</el-button
        >
      </template>
    </CommonList>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import CommonList from "@/components/CommonList.vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { Search } from "@element-plus/icons-vue";
import { useUserStore } from "@/stores/user";
import { ActivityStatus, Role, type Column } from "@/types";
import { getActivities } from "@/api/activity";

const userStore = useUserStore();
const searchQuery = ref("");
const activities = ref<any[]>([]);
const loading = ref(false);
const total = ref(0);
const currentPage = ref(1);
const pageSize = ref(10);

const columns: Column[] = [
  { label: "封面", prop: "coverImage", type: "image", width: "120" },
  { label: "活动名称", prop: "name", minWidth: "150" },
  { label: "所属社团", prop: "club.name", minWidth: "120" },
  { label: "开始时间", prop: "date", width: "160" },
  { label: "结束时间", prop: "endAt", width: "160" },
  {
    label: "状态",
    prop: "status",
    type: "tag",
    width: "120",
    tagMap: {
      [ActivityStatus.APPROVED]: { label: "已发布", type: "success" },
      [ActivityStatus.ONGOING]: { label: "进行中", type: "primary" },
      [ActivityStatus.FINISHED]: { label: "已结束", type: "info" },
      [ActivityStatus.PENDING]: { label: "待审核", type: "warning" },
      [ActivityStatus.REJECTED]: { label: "已拒绝", type: "danger" },
      [ActivityStatus.DRAFT]: { label: "草稿", type: "info" },
      [ActivityStatus.CANCELED]: { label: "已取消", type: "danger" },
    },
  },
];

const fetchActivities = async () => {
  loading.value = true;
  try {
    const data = await getActivities({
      page: currentPage.value,
      pageSize: pageSize.value,
      search: searchQuery.value,
    });
    activities.value = data.list;
    total.value = data.total;
  } catch (error: any) {
    ElMessage.error(error.message || "获取列表失败");
  } finally {
    loading.value = false;
  }
};

const handleSearch = () => {
  currentPage.value = 1;
  fetchActivities();
};

const handlePageChange = (page: number) => {
  currentPage.value = page;
  fetchActivities();
};

onMounted(() => {
  fetchActivities();
});

// ... rest of handlers
const handlePublish = () => {
  ElMessage.info("功能开发中");
};

const handleEdit = (row: any) => {
  // Logic to be implemented
};

const handleRecruit = (row: any) => {
  // Logic to be implemented
};

const handleDelete = (row: any) => {
  // Logic to be implemented
};

const handleAudit = (row: any) => {
  // Logic to be implemented
};

const handleViewDetail = (row: any) => {
  // Logic to be implemented
};
</script>
