<template>
  <div class="club-management">
    <CommonList title="社团管理" :data="clubs" :columns="columns" :total="total" action-width="320"
      :current-page="currentPage" :page-size="pageSize" @page-change="handlePageChange">
      <template #header-actions>
        <el-button type="primary" @click="handleAddClub">创建社团</el-button>
        <el-input v-model="searchQuery" placeholder="搜索社团名称/类型/负责人" prefix-icon="Search"
          style="width: 240px; margin-left: 12px" clearable @input="handleSearch" />
      </template>

      <template #actions="{ row }">
        <template v-if="row.status === 'PENDING'">
          <el-button type="success" link @click="handleApprove(row)">通过</el-button>
          <el-button type="danger" link @click="handleReject(row)">拒绝</el-button>
        </template>
        <el-button type="info" link @click="handleViewMaterials(row)">查看手续</el-button>
        <el-button type="primary" link @click="handleDetail(row)">详情</el-button>
        <el-button type="danger" link @click="handleDelete(row)">解散</el-button>
      </template>
    </CommonList>

    <el-dialog v-model="materialsDialogVisible" title="社团手续" width="700px">
      <div v-if="currentMaterialsUrl" class="materials-container">
        <el-image
          v-if="materialsIsImage"
          :src="currentMaterialsUrl"
          fit="contain"
          :preview-src-list="[currentMaterialsUrl]"
          class="materials-image"
        />
        <div v-else class="materials-file">
          <el-link :href="currentMaterialsUrl" target="_blank" type="primary"
            >打开文件</el-link
          >
        </div>
      </div>
      <el-empty v-else description="暂无手续文件" />
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import CommonList from "@/components/CommonList.vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { Search } from "@element-plus/icons-vue";
import { Status, ClubType, type Column } from "@/types";
import { getClubs } from "@/api/club";

import { useRouter } from "vue-router";

const router = useRouter();
const searchQuery = ref("");
const clubs = ref<any[]>([]);
const loading = ref(false);
const total = ref(0);
const currentPage = ref(1);
const pageSize = ref(10);

const materialsDialogVisible = ref(false);
const currentMaterialsUrl = ref<string>("");

const BASE_URL = import.meta.env.VITE_API_BASE_URL.replace(/\/api\/?$/, "");

const getFullUrl = (path?: string) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${BASE_URL}${path}`;
};

const materialsIsImage = computed(() => {
  const url = currentMaterialsUrl.value;
  return /\.(png|jpe?g|gif|webp)$/i.test(url);
});

const columns: Column[] = [
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
      [ClubType.TECH]: { label: "科技类", type: "" },
      [ClubType.ENTERTAINMENT]: { label: "娱乐类", type: "success" },
      [ClubType.OTHER]: { label: "其他", type: "info" },
    },
  },
  { label: "负责人", prop: "leader.realName", width: "100" },
  {
    label: "状态",
    prop: "status",
    type: "tag",
    width: "120",
    tagMap: {
      [Status.PENDING]: { label: "待审批", type: "warning" },
      [Status.APPROVED]: { label: "正常", type: "success" },
      [Status.REJECTED]: { label: "已驳回", type: "danger" },
    },
  },
  { label: "创建时间", prop: "createdAt", width: "120" },
];

const fetchClubs = async () => {
  loading.value = true;
  try {
    const data = await getClubs({
      page: currentPage.value,
      pageSize: pageSize.value,
      search: searchQuery.value,
    });
    clubs.value = data.list;
    total.value = data.total;
  } catch (error: any) {
    ElMessage.error(error.message || "获取列表失败");
  } finally {
    loading.value = false;
  }
};

const handleSearch = () => {
  currentPage.value = 1;
  fetchClubs();
};

const handlePageChange = (page: number) => {
  currentPage.value = page;
  fetchClubs();
};

onMounted(() => {
  fetchClubs();
});

const handleApprove = (row: any) => {
  ElMessageBox.confirm(`确定要通过社团 ${row.name} 的创建申请吗？`, '审批提示', {
    type: 'success'
  }).then(() => {
    row.status = Status.APPROVED
    ElMessage.success('审批已通过')
  })
}

const handleReject = (row: any) => {
  ElMessageBox.prompt(`请输入拒绝社团 ${row.name} 的原因`, '审批提示', {
    inputPlaceholder: '拒绝原因',
    type: 'warning'
  }).then((data: any) => {
    const value = data.value
    row.status = Status.REJECTED
    ElMessage.warning(`申请已驳回，原因: ${value}`)
  }).catch(() => {
    // 用户取消操作，不做处理
  })
}

const handleAddClub = () => {
  ElMessage.info('前往创建社团页面')
}

const handleDetail = (row: any) => {
  router.push(`/clubs/${row.id}`);
};

const handleViewMaterials = (row: any) => {
  const url = getFullUrl(row.materials);
  if (!url) {
    ElMessage.info("该社团暂无手续文件");
    return;
  }
  currentMaterialsUrl.value = url;
  materialsDialogVisible.value = true;
};

const handleDelete = (row: any) => {
  ElMessageBox.confirm(`确定要解散社团 ${row.name} 吗？解散后不可恢复！`, '警告', {
    type: 'error'
  }).then(() => {
    clubs.value = clubs.value.filter(c => c.id !== row.id)
    ElMessage.success('社团已解散')
  })
}
</script>

<style scoped>
.materials-container {
  display: flex;
  justify-content: center;
}

.materials-image {
  width: 100%;
  max-height: 520px;
}

.materials-file {
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 24px 0;
}
</style>
