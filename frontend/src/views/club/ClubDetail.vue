<template>
  <div class="club-detail-container" v-loading="loading">
    <div v-if="club" class="club-content">
      <!-- 头部信息 -->
      <el-card shadow="never" class="club-header-card">
        <div class="club-header">
          <div class="club-cover-wrapper">
            <el-image
              v-if="club.coverImage"
              :src="getFullUrl(club.coverImage)"
              fit="cover"
              class="club-cover"
              :preview-src-list="[getFullUrl(club.coverImage)]"
            />
            <div
              v-else
              class="club-cover-placeholder"
              :style="{ background: randomGradient }"
            >
              <span>{{ club.name.slice(0, 2) }}</span>
            </div>
          </div>
          <div class="club-info">
            <div class="info-top">
              <h1 class="club-name">{{ club.name }}</h1>
              <el-tag :type="clubTypeInfo.type" effect="dark" class="club-type">
                {{ clubTypeInfo.label }}
              </el-tag>
            </div>
            <div class="info-meta">
              <div class="meta-item">
                <el-icon><User /></el-icon>
                <span
                  >社长：{{
                    club.leader?.realName || club.leader?.username
                  }}</span
                >
              </div>
              <div class="meta-item">
                <el-icon><Calendar /></el-icon>
                <span>成立时间：{{ club.createdAt }}</span>
              </div>
              <div class="meta-item">
                <el-icon><UserFilled /></el-icon>
                <span>成员：{{ (club._count?.members || 0) + 1 }} 人</span>
              </div>
            </div>
            <div class="club-description">
              <h3>社团简介</h3>
              <p>{{ club.description || "暂无简介" }}</p>
            </div>
            <div class="club-actions">
              <!-- 负责人操作 -->
              <template v-if="isLeader">
                <el-button type="primary" @click="handleEdit">
                  编辑社团信息
                </el-button>
                <el-button type="primary" plain @click="handleAddActivity">
                  发布活动
                </el-button>
              </template>

              <!-- 普通用户操作 -->
              <template v-else>
                <!-- 未加入 -->
                <el-button
                  v-if="!club.isMember && !club.membershipStatus"
                  type="primary"
                  @click="handleJoin"
                >
                  申请入社
                </el-button>
                <!-- 申请中 -->
                <el-button
                  v-else-if="club.membershipStatus === MembershipStatus.PENDING"
                  type="info"
                  disabled
                >
                  入社申请审核中
                </el-button>
                <!-- 已加入 -->
                <el-button
                  v-else-if="club.membershipStatus === MembershipStatus.APPROVED"
                  type="danger"
                  plain
                  @click="handleLeave"
                >
                  退出社团
                </el-button>
                <!-- 被拒绝 -->
                <el-button
                  v-else-if="club.membershipStatus === MembershipStatus.REJECTED"
                  type="warning"
                  plain
                  disabled
                >
                  申请已被拒绝
                </el-button>
              </template>
            </div>
          </div>
        </div>
      </el-card>

      <!-- 内容标签页 -->
      <el-tabs v-model="activeTab" class="club-tabs" type="border-card">
        <el-tab-pane label="社团活动" name="activities">
          <div class="tab-content">
            <!-- 这里可以复用 ActivityList 组件，或者简单的列表 -->
            <el-empty description="暂无活动" />
          </div>
        </el-tab-pane>
        <el-tab-pane label="社团成员" name="members">
          <div class="tab-content">
            <el-table :data="members" style="width: 100%" v-loading="membersLoading">
              <el-table-column label="头像" width="80">
                <template #default="{ row }">
                  <el-avatar :size="40" :src="getAvatarUrl(row.avatar)" />
                </template>
              </el-table-column>
              <el-table-column prop="username" label="用户名" />
              <el-table-column prop="realName" label="真实姓名" />
              <el-table-column prop="joinedAt" label="加入时间" width="180" />
              <el-table-column label="角色" width="120">
                <template #default="{ row }">
                  <el-tag v-if="row.roleInClub === 'LEADER' || row.id === club.leaderId" type="danger">社长</el-tag>
                  <el-tag v-else type="info">成员</el-tag>
                </template>
              </el-table-column>
            </el-table>
            <div class="pagination-wrapper" v-if="membersTotal > 0">
              <el-pagination
                v-model:current-page="membersPage"
                v-model:page-size="membersPageSize"
                :total="membersTotal"
                layout="total, prev, pager, next"
                @current-change="fetchMembers"
              />
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <el-empty v-else description="社团不存在或已被删除" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useUserStore } from "@/stores/user";
import { ElMessage, ElMessageBox } from "element-plus";
import { User, Calendar, UserFilled } from "@element-plus/icons-vue";
import {
  getClubDetail,
  joinClub,
  leaveClub,
  getClubMembers,
} from "@/api/club";
import { ClubType, MembershipStatus } from "@/types";

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();

const clubId = parseInt(route.params.id as string, 10);
const club = ref<any>(null);
const loading = ref(false);
const activeTab = ref("activities");

// 成员列表相关
const members = ref<any[]>([]);
const membersLoading = ref(false);
const membersTotal = ref(0);
const membersPage = ref(1);
const membersPageSize = ref(10);

const isLeader = computed(() => {
  return userStore.user?.id === club.value?.leaderId;
});

const BASE_URL = import.meta.env.VITE_API_BASE_URL.replace(/\/api\/?$/, "");

const getFullUrl = (path?: string) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${BASE_URL}${path}`;
};

const getAvatarUrl = (path?: string) => {
  if (!path)
    return "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png";
  if (path.startsWith("http")) return path;
  return `${BASE_URL}${path}`;
};

// 社团类型映射
const clubTypeMap: Record<string, { label: string; type: string }> = {
  [ClubType.ACADEMIC]: { label: "学术类", type: "primary" },
  [ClubType.SPORTS]: { label: "体育类", type: "success" },
  [ClubType.ARTS]: { label: "文艺类", type: "warning" },
  [ClubType.VOLUNTEER]: { label: "志愿公益类", type: "danger" },
  [ClubType.TECH]: { label: "科技类", type: "info" },
  [ClubType.ENTERTAINMENT]: { label: "娱乐类", type: "success" },
  [ClubType.OTHER]: { label: "其他", type: "info" },
};

const clubTypeInfo = computed(() => {
  const type = club.value?.type || ClubType.OTHER;
  return clubTypeMap[type] || { label: "未知", type: "info" };
});

const randomGradient = computed(() => {
  if (!club.value) return "";
  const gradients = [
    "linear-gradient(135deg, #a5d6a7 0%, #4caf50 100%)",
    "linear-gradient(135deg, #42a5f5 0%, #1e88e5 100%)",
    "linear-gradient(135deg, #ef5350 0%, #d32f2f 100%)",
    "linear-gradient(135deg, #ffca28 0%, #ff6f00 100%)",
    "linear-gradient(135deg, #ab47bc 0%, #7b1fa2 100%)",
  ];
  return gradients[club.value.id % gradients.length];
});

const fetchDetail = async () => {
  loading.value = true;
  try {
    const data = await getClubDetail(clubId);
    club.value = data;
    // 加载成功后获取成员列表
    fetchMembers();
  } catch (error: any) {
    ElMessage.error(error.message || "获取社团详情失败");
  } finally {
    loading.value = false;
  }
};

const fetchMembers = async () => {
  membersLoading.value = true;
  try {
    const res = await getClubMembers(clubId, {
      page: membersPage.value,
      pageSize: membersPageSize.value,
    });
    members.value = res.list;
    membersTotal.value = res.total;
  } catch (error: any) {
    console.error("获取成员列表失败", error);
  } finally {
    membersLoading.value = false;
  }
};

const handleJoin = async () => {
  try {
    await ElMessageBox.confirm("确定要申请加入该社团吗？", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "info",
    });
    await joinClub(clubId);
    ElMessage.success("申请已提交，请等待审核");
    fetchDetail(); // 刷新状态
  } catch (error: any) {
    if (error !== "cancel") {
      ElMessage.error(error.message || "申请失败");
    }
  }
};

const handleLeave = async () => {
  try {
    if (isLeader.value) {
      ElMessage.warning("社团负责人退出社团请联系管理员");
      return;
    }
    await ElMessageBox.confirm("确定要退出该社团吗？", "警告", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    });
    await leaveClub(clubId);
    ElMessage.success("已退出社团");
    fetchDetail(); // 刷新状态
  } catch (error: any) {
    if (error !== "cancel") {
      ElMessage.error(error.message || "退出失败");
    }
  }
};

const handleEdit = () => {
  ElMessage.info("功能开发中");
  // router.push(`/leader/club/${clubId}/edit`);
};

const handleAddActivity = () => {
  router.push("/leader/add-activity");
};

onMounted(() => {
  fetchDetail();
});
</script>

<style scoped>
.club-detail-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.club-header-card {
  margin-bottom: 20px;
}

.club-header {
  display: flex;
  gap: 30px;
}

.club-cover-wrapper {
  width: 300px;
  height: 200px;
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;
}

.club-cover {
  width: 100%;
  height: 100%;
}

.club-cover-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.9);
  font-size: 64px;
  font-weight: bold;
}

.club-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.info-top {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.club-name {
  margin: 0;
  font-size: 28px;
  color: #303133;
}

.info-meta {
  display: flex;
  gap: 24px;
  color: #606266;
  font-size: 14px;
  margin-bottom: 20px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 6px;
}

.club-description {
  flex: 1;
  margin-bottom: 20px;
}

.club-description h3 {
  margin: 0 0 8px 0;
  font-size: 16px;
  color: #303133;
}

.club-description p {
  margin: 0;
  color: #606266;
  line-height: 1.6;
  font-size: 14px;
}

.club-actions {
  display: flex;
  gap: 12px;
}

.club-tabs {
  min-height: 400px;
}

.tab-content {
  padding: 20px 0;
}

.pagination-wrapper {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>