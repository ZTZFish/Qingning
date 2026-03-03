<template>
  <div class="activity-management">
    <CommonList
      :title="pageTitle"
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
        >
          发布活动
        </el-button>
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
          <el-button type="primary" link :disabled="isEditDisabled(row)" @click="handleEdit(row)">
            编辑
          </el-button>
          <el-button
            v-if="row.status !== 'CANCELED'"
            type="danger"
            link
            @click="handleDelete(row)"
          >
            取消活动
          </el-button>
        </template>

        <!-- 管理员特有操作 -->
        <template v-else-if="userStore.user?.role === 'ADMIN'">
          <el-button
            v-if="row.status === 'PENDING'"
            type="success"
            link
            @click="handleAudit(row, 'APPROVED')"
          >
            通过
          </el-button>
          <el-button
            v-if="row.status === 'PENDING'"
            type="danger"
            link
            @click="handleAudit(row, 'REJECTED')"
          >
            拒绝
          </el-button>
          <el-button type="danger" link @click="handleDelete(row)">
            删除
          </el-button>
        </template>

        <el-button type="info" link @click="handleViewDetail(row)">
          详情
        </el-button>
      </template>
    </CommonList>

    <el-dialog v-model="detailVisible" title="活动详情" width="720px">
      <div v-if="currentDetail" class="detail-body">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="活动名称">{{ currentDetail.name }}</el-descriptions-item>
          <el-descriptions-item label="所属社团">{{ currentDetail.club?.name || '-' }}</el-descriptions-item>
          <el-descriptions-item label="开始时间">{{ currentDetail.date }}</el-descriptions-item>
          <el-descriptions-item label="结束时间">{{ currentDetail.endAt }}</el-descriptions-item>
          <el-descriptions-item label="活动地点">{{ currentDetail.location || '未填写' }}</el-descriptions-item>
          <el-descriptions-item label="状态">
            <el-tag :type="statusTagType(currentDetail.status)">
              {{ statusLabel(currentDetail.status) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="活动简介" :span="2">
            {{ currentDetail.description || '暂无简介' }}
          </el-descriptions-item>
          <el-descriptions-item label="活动封面" :span="2">
            <el-image
              v-if="currentDetail.coverImage"
              :src="getFullUrl(currentDetail.coverImage)"
              fit="cover"
              style="width: 240px; height: 135px; border-radius: 6px"
              :preview-src-list="[getFullUrl(currentDetail.coverImage)]"
            />
            <span v-else>未上传</span>
          </el-descriptions-item>
        </el-descriptions>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import CommonList from "@/components/CommonList.vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { Search } from "@element-plus/icons-vue";
import { useUserStore } from "@/stores/user";
import { ActivityStatus, type Column } from "@/types";
import { getActivities, cancelActivity, deleteActivity, auditActivity, getActivityDetail } from "@/api/activity";

const userStore = useUserStore();
const router = useRouter();
const searchQuery = ref("");
const activities = ref<any[]>([]);
const loading = ref(false);
const total = ref(0);
const currentPage = ref(1);
const pageSize = ref(10);

const detailVisible = ref(false);
const currentDetail = ref<any | null>(null);

const pageTitle = computed(() => {
  return userStore.user?.role === "ADMIN" ? "活动管理 (管理员)" : "社团活动管理";
});

const BASE_URL = import.meta.env.VITE_API_BASE_URL.replace(/\/api\/?$/, "");
const getFullUrl = (path?: string) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${BASE_URL}${path}`;
};

const isEditDisabled = (row: any) => {
  return (
    row.status === ActivityStatus.PENDING ||
    row.status === ActivityStatus.ONGOING ||
    row.status === ActivityStatus.FINISHED ||
    row.status === ActivityStatus.APPROVED
  );
};

const statusLabel = (status: string) => {
  const map: Record<string, string> = {
    [ActivityStatus.DRAFT]: "草稿",
    [ActivityStatus.PENDING]: "待审核",
    [ActivityStatus.APPROVED]: "已发布",
    [ActivityStatus.REJECTED]: "已拒绝",
    [ActivityStatus.ONGOING]: "进行中",
    [ActivityStatus.FINISHED]: "已结束",
    [ActivityStatus.CANCELED]: "已取消",
  };
  return map[status] || status;
};

const statusTagType = (status: string) => {
  const map: Record<string, any> = {
    [ActivityStatus.DRAFT]: "info",
    [ActivityStatus.PENDING]: "warning",
    [ActivityStatus.APPROVED]: "success",
    [ActivityStatus.REJECTED]: "danger",
    [ActivityStatus.ONGOING]: "primary",
    [ActivityStatus.FINISHED]: "info",
    [ActivityStatus.CANCELED]: "danger",
  };
  return map[status] || "info";
};

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

const handlePublish = () => {
  router.push("/leader/add-activity");
};

const handleEdit = (row: any) => {
  if (isEditDisabled(row)) return;
  router.push({ path: "/leader/add-activity", query: { id: String(row.id) } });
};

const handleDelete = (row: any) => {
  ElMessageBox.confirm("确定要删除/取消该活动吗？", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      if (userStore.user?.role === "ADMIN") {
        return deleteActivity(row.id).then(() => {
          ElMessage.success("活动已删除");
          fetchActivities();
        });
      } else if (userStore.user?.role === "LEADER") {
        return cancelActivity(row.id).then(() => {
          ElMessage.success("活动已取消");
          fetchActivities();
        });
      } else {
        ElMessage.warning("无权操作");
      }
    })
    .catch(() => { });
};

const handleAudit = (row: any, status: string) => {
  auditActivity(row.id, { status: status as any })
    .then(() => {
      ElMessage.success(`已${status === "APPROVED" ? "通过" : "拒绝"}审核`);
      fetchActivities();
    })
    .catch((error: any) => {
      ElMessage.error(error.message || "操作失败");
    });
};

const handleViewDetail = (row: any) => {
  getActivityDetail(row.id)
    .then((res: any) => {
      currentDetail.value = res;
      detailVisible.value = true;
    })
    .catch((error: any) => {
      ElMessage.error(error.message || "获取详情失败");
    });
};

onMounted(() => {
  fetchActivities();
});
</script>

<style scoped>
.activity-management {
  padding: 20px;
}

.detail-body {
  padding-top: 4px;
}
</style>
