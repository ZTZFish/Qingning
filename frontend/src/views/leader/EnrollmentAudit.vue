<template>
  <div class="enrollment-audit-container">
    <el-card shadow="never">
      <template #header>
        <div class="card-header">
          <span>活动报名审核</span>
          <el-select
            v-model="selectedActivityId"
            placeholder="请选择活动"
            style="width: 240px"
            @change="handleActivityChange"
          >
            <el-option
              v-for="item in myActivities"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </div>
      </template>

      <div v-if="!selectedActivityId" class="empty-tip">
        请先选择一个活动查看报名名单
      </div>

      <div v-else>
        <div class="filter-bar">
          <el-radio-group v-model="statusFilter" @change="handleFilterChange">
            <el-radio-button label="">全部</el-radio-button>
            <el-radio-button label="PENDING">待审核</el-radio-button>
            <el-radio-button label="APPROVED">已通过</el-radio-button>
            <el-radio-button label="REJECTED">已拒绝</el-radio-button>
          </el-radio-group>
        </div>

        <el-table v-loading="loading" :data="enrollments" style="width: 100%">
          <el-table-column prop="avatar" label="头像" width="80">
            <template #default="{ row }">
              <el-avatar :src="row.avatar" :size="40">{{ row.realName?.[0] || row.username[0] }}</el-avatar>
            </template>
          </el-table-column>
          <el-table-column prop="realName" label="姓名" width="120">
            <template #default="{ row }">
              {{ row.realName || row.username }}
            </template>
          </el-table-column>
          <el-table-column prop="studentId" label="学号" width="120" />
          <el-table-column prop="sex" label="性别" width="80">
            <template #default="{ row }">
              {{ row.sex === 'MALE' ? '男' : '女' }}
            </template>
          </el-table-column>
          <el-table-column prop="joinedAt" label="报名时间" width="180" />
          <el-table-column prop="notes" label="备注" min-width="150" show-overflow-tooltip />
          <el-table-column prop="status" label="状态" width="100">
            <template #default="{ row }">
              <el-tag :type="getStatusType(row.status)">
                {{ getStatusText(row.status) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150" fixed="right">
            <template #default="{ row }">
              <div v-if="row.status === 'PENDING'">
                <el-button
                  type="success"
                  link
                  size="small"
                  @click="handleAudit(row, 'APPROVED')"
                >
                  通过
                </el-button>
                <el-button
                  type="danger"
                  link
                  size="small"
                  @click="handleAudit(row, 'REJECTED')"
                >
                  拒绝
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>

        <div class="pagination-wrapper">
          <el-pagination
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :total="total"
            :page-sizes="[10, 20, 50]"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { ElMessage } from "element-plus";
import { getActivities, getActivityEnrollments, auditEnrollment } from "@/api/activity";
import { useRoute } from "vue-router";
import { useUserStore } from "@/stores/user";

const route = useRoute();
const userStore = useUserStore();
const myActivities = ref<any[]>([]);
const selectedActivityId = ref<number | undefined>(undefined);
const enrollments = ref<any[]>([]);
const loading = ref(false);
const total = ref(0);
const currentPage = ref(1);
const pageSize = ref(10);
const statusFilter = ref("");

const fetchMyActivities = async () => {
  try {
    // 获取负责人负责的活动（复用活动列表接口，后端会自动过滤）
    const res = await getActivities({ page: 1, pageSize: 100 });
    myActivities.value = res.list.filter((a: any) =>
      // 过滤出未删除且未结束的活动（可选）
      a.status !== 'CANCELED'
    );

    // 如果有路由参数传入 activityId，则优先选中
    if (route.query.activityId) {
      const targetId = parseInt(route.query.activityId as string);
      if (myActivities.value.find(a => a.id === targetId)) {
        selectedActivityId.value = targetId;
      } else if (myActivities.value.length > 0) {
        selectedActivityId.value = myActivities.value[0].id;
      }
    } else if (myActivities.value.length > 0 && !selectedActivityId.value) {
      selectedActivityId.value = myActivities.value[0].id;
    }

    if (selectedActivityId.value) {
      fetchEnrollments();
    }
  } catch (error: any) {
    ElMessage.error("获取活动列表失败");
  }
};

const fetchEnrollments = async () => {
  if (!selectedActivityId.value) return;
  loading.value = true;
  try {
    const res = await getActivityEnrollments(selectedActivityId.value, {
      page: currentPage.value,
      pageSize: pageSize.value,
      status: statusFilter.value || undefined,
    });
    enrollments.value = res.list;
    total.value = res.total;
  } catch (error: any) {
    ElMessage.error(error.message || "获取报名名单失败");
  } finally {
    loading.value = false;
  }
};

const handleActivityChange = () => {
  currentPage.value = 1;
  fetchEnrollments();
};

const handleFilterChange = () => {
  currentPage.value = 1;
  fetchEnrollments();
};

const handleSizeChange = (val: number) => {
  pageSize.value = val;
  fetchEnrollments();
};

const handleCurrentChange = (val: number) => {
  currentPage.value = val;
  fetchEnrollments();
};

const handleAudit = async (row: any, status: "APPROVED" | "REJECTED") => {
  try {
    if (!selectedActivityId.value) return;
    await auditEnrollment(selectedActivityId.value, row.id, status);
    ElMessage.success("操作成功");
    fetchEnrollments();
  } catch (error: any) {
    ElMessage.error(error.message || "操作失败");
  }
};

const getStatusType = (status: string) => {
  const map: any = {
    PENDING: "warning",
    APPROVED: "success",
    REJECTED: "danger",
  };
  return map[status] || "info";
};

const getStatusText = (status: string) => {
  const map: any = {
    PENDING: "待审核",
    APPROVED: "已通过",
    REJECTED: "已拒绝",
  };
  return map[status] || status;
};

onMounted(() => {
  fetchMyActivities();
});
</script>

<style scoped>
.enrollment-audit-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.empty-tip {
  text-align: center;
  padding: 40px;
  color: #909399;
}

.filter-bar {
  margin-bottom: 20px;
}

.pagination-wrapper {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>