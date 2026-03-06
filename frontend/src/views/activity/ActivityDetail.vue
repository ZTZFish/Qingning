<template>
  <div class="activity-detail-container" v-loading="loading">
    <el-card v-if="activity" shadow="never" class="detail-card">
      <div class="header">
        <el-image
          :src="getCoverUrl(activity.coverImage)"
          fit="cover"
          class="cover-image"
        />
        <div class="header-info">
          <h1 class="title">{{ activity.name }}</h1>
          <div class="status-tags">
            <el-tag :type="statusTagType">{{ statusText }}</el-tag>
            <el-tag type="info" class="club-tag" @click="goToClub">
              {{ activity.club?.name }}
            </el-tag>
          </div>
          <div class="meta-info">
            <div class="meta-item">
              <el-icon><Calendar /></el-icon>
              <span>开始时间：{{ activity.date }}</span>
            </div>
            <div class="meta-item">
              <el-icon><Timer /></el-icon>
              <span>结束时间：{{ activity.endAt }}</span>
            </div>
            <div class="meta-item">
              <el-icon><Location /></el-icon>
              <span>活动地点：{{ activity.location || '线上/待定' }}</span>
            </div>
          </div>
          
          <!-- 报名状态展示 -->
          <div class="action-area">
            <template v-if="isLeader">
              <el-button type="primary" size="large" @click="goToEnrollmentAudit">
                查看报名
              </el-button>
            </template>
            <template v-else-if="activity.myParticipation">
              <el-alert
                v-if="activity.myParticipation.status === 'PENDING'"
                title="已报名，等待审核"
                type="warning"
                show-icon
                :closable="false"
              />
              <el-alert
                v-else-if="activity.myParticipation.status === 'APPROVED'"
                title="报名已通过"
                type="success"
                show-icon
                :closable="false"
              />
              <el-alert
                v-else-if="activity.myParticipation.status === 'REJECTED'"
                title="报名被拒绝"
                type="error"
                show-icon
                :closable="false"
              />
            </template>
            <el-button
              v-else
              type="primary"
              size="large"
              :disabled="!canEnroll"
              @click="handleEnroll"
            >
              {{ enrollButtonText }}
            </el-button>
          </div>
        </div>
      </div>

      <el-divider />

      <div class="content">
        <h3>活动详情</h3>
        <p class="description">{{ activity.description }}</p>
      </div>

      <el-divider />

      <div class="admitted-members">
        <h3>已录取人员 ({{ admittedTotal }})</h3>
        <div class="members-list">
          <!-- 固定显示社长 -->
          <div v-if="activity && activity.club?.leader" class="member-item">
            <el-avatar :src="getCoverUrl(activity.club.leader.avatar)" :size="50">
              {{ activity.club.leader.realName?.[0] || activity.club.leader.username[0] }}
            </el-avatar>
            <span class="member-name">{{ activity.club.leader.realName || activity.club.leader.username }}</span>
            <el-tag size="small" type="danger" effect="plain">社长</el-tag>
          </div>
          
          <!-- 显示其他录取人员 -->
          <template v-if="admittedMembers.length">
            <div v-for="member in admittedMembers" :key="member.id" class="member-item">
              <el-avatar :src="getCoverUrl(member.avatar)" :size="50">
                {{ member.realName?.[0] || member.username[0] }}
              </el-avatar>
              <span class="member-name">{{ member.realName || member.username }}</span>
            </div>
          </template>
        </div>
        <el-empty v-if="!activity?.club?.leader && !admittedMembers.length" description="暂无录取人员" :image-size="100" />
      </div>
    </el-card>

    <!-- 报名弹窗 -->
    <el-dialog
      v-model="enrollDialogVisible"
      title="报名活动"
      width="400px"
    >
      <el-form :model="enrollForm" label-width="80px">
        <el-form-item label="备注信息">
          <el-input
            v-model="enrollForm.notes"
            type="textarea"
            :rows="3"
            placeholder="请输入备注信息（选填）"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="enrollDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitEnroll" :loading="submitting">
            确认报名
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { Calendar, Timer, Location } from "@element-plus/icons-vue";
import { getActivityDetail, enrollActivity, getAdmittedMembers } from "@/api/activity";
import { ActivityStatus } from "@/types";
import { useUserStore } from "@/stores/user";

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
const activityId = parseInt(route.params.id as string);

const activity = ref<any>(null);
const loading = ref(false);
const enrollDialogVisible = ref(false);
const submitting = ref(false);
const enrollForm = ref({ notes: "" });
const admittedMembers = ref<any[]>([]);
const admittedTotal = ref(1);

const BASE_URL = import.meta.env.VITE_API_BASE_URL.replace(/\/api\/?$/, "");

const getCoverUrl = (path?: string) => {
  if (!path) return "https://via.placeholder.com/800x400";
  if (path.startsWith("http")) return path;
  return `${BASE_URL}${path}`;
};

const isLeader = computed(() => {
  if (!activity.value || !userStore.user) return false;
  // 假设 activity.club.leaderId 存在，或者通过 activity.clubId 和 userStore.user.ledClubs 判断
  // 暂时通过 activity.club?.leaderId 判断（需要在 getDetail 中返回）
  // 实际上后端 findActivityById 已经 include 了 club.leaderId
  return activity.value.club?.leaderId === userStore.user.id;
});

const displayStatus = computed(() => {
  if (!activity.value) return "";
  if (activity.value.status === ActivityStatus.APPROVED) {
    const now = new Date().getTime();
    const start = new Date(activity.value.date).getTime();
    const end = new Date(activity.value.endAt).getTime();

    if (now < start) return ActivityStatus.APPROVED; // Upcoming
    if (now >= start && now < end) return ActivityStatus.ONGOING; // Ongoing
    if (now >= end) return ActivityStatus.FINISHED; // Finished
  }
  return activity.value.status;
});

const statusTagType = computed(() => {
  const map: any = {
    [ActivityStatus.APPROVED]: "success",
    [ActivityStatus.ONGOING]: "primary",
    [ActivityStatus.FINISHED]: "info",
    [ActivityStatus.CANCELED]: "danger",
    [ActivityStatus.PENDING]: "warning",
    [ActivityStatus.REJECTED]: "danger",
    [ActivityStatus.DRAFT]: "info"
  };
  return map[displayStatus.value] || "info";
});

const statusText = computed(() => {
  const map: any = {
    [ActivityStatus.APPROVED]: "即将开始", // 已发布但未开始
    [ActivityStatus.ONGOING]: "进行中",
    [ActivityStatus.FINISHED]: "已结束",
    [ActivityStatus.CANCELED]: "已取消",
    [ActivityStatus.PENDING]: "待审核",
    [ActivityStatus.REJECTED]: "已拒绝",
    [ActivityStatus.DRAFT]: "草稿"
  };
  return map[displayStatus.value] || "未知状态";
});

const canEnroll = computed(() => {
  if (!activity.value) return false;
  // 只有“即将开始”或“进行中”可以报名
  const status = displayStatus.value;
  return (
    status === ActivityStatus.APPROVED ||
    status === ActivityStatus.ONGOING
  );
});

const enrollButtonText = computed(() => {
  if (!canEnroll.value) {
    const status = displayStatus.value;
    if (status === ActivityStatus.FINISHED) return "活动已结束";
    if (status === ActivityStatus.CANCELED) return "活动已取消";
    return "不可报名";
  }
  return "立即报名";
});

const fetchDetail = async () => {
  loading.value = true;
  try {
    const res = await getActivityDetail(activityId);
    activity.value = res;
    fetchAdmittedMembers();
  } catch (error: any) {
    ElMessage.error(error.message || "获取活动详情失败");
    router.back();
  } finally {
    loading.value = false;
  }
};

const fetchAdmittedMembers = async () => {
  try {
    const res = await getAdmittedMembers(activityId);
    admittedMembers.value = res.list;
    // 总人数 = 接口返回的已录取人数 + 社长(1)
    // 只有当活动有社长时才+1
    const leaderCount = activity.value?.club?.leader ? 1 : 0;
    admittedTotal.value = res.total + leaderCount;
  } catch (error) {
    console.error("获取已录取人员失败", error);
  }
};

const handleEnroll = () => {
  enrollDialogVisible.value = true;
};

const submitEnroll = async () => {
  submitting.value = true;
  try {
    await enrollActivity(activityId, enrollForm.value.notes);
    ElMessage.success("报名成功");
    enrollDialogVisible.value = false;
    fetchDetail(); // 刷新状态
  } catch (error: any) {
    ElMessage.error(error.message || "报名失败");
  } finally {
    submitting.value = false;
  }
};

const goToClub = () => {
  if (activity.value?.clubId) {
    router.push(`/clubs/${activity.value.clubId}`);
  }
};

const goToEnrollmentAudit = () => {
  // 跳转到侧边栏的活动录取审核页，并可以通过 query 传递当前活动 ID（需要在目标页面处理）
  router.push({ name: 'activity-enrollments', query: { activityId: activityId } });
};

onMounted(() => {
  fetchDetail();
});
</script>

<style scoped>
.activity-detail-container {
  max-width: 1000px;
  margin: 20px auto;
  padding: 0 20px;
}

.detail-card {
  min-height: 600px;
}

.header {
  display: flex;
  gap: 30px;
  margin-bottom: 30px;
}

.cover-image {
  width: 400px;
  height: 250px;
  border-radius: 8px;
  object-fit: cover;
}

.header-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.title {
  font-size: 24px;
  margin: 0 0 16px;
  color: #303133;
}

.status-tags {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
}

.club-tag {
  cursor: pointer;
}

.meta-info {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 24px;
  color: #606266;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.action-area {
  margin-top: auto;
}

.content {
  padding: 20px 0;
}

.description {
  white-space: pre-wrap;
  line-height: 1.6;
  color: #303133;
  font-size: 16px;
}

.admitted-members {
  padding: 20px 0;
}

.members-list {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-top: 20px;
}

.member-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  width: 80px;
}

.member-name {
  font-size: 14px;
  color: #606266;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
}
</style>