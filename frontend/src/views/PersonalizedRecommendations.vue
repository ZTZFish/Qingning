<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { getRecommendations } from "@/api/recommendation";
import { useUserStore } from "@/stores/user";
import type { Activity, Club } from "@/types";

const router = useRouter();
const userStore = useUserStore();

const loading = ref(false);
const tags = computed(() => userStore.user?.tags || []);

const clubs = ref<Club[]>([]);
const activities = ref<Activity[]>([]);

const clubTypeMap: Record<string, string> = {
  ACADEMIC: "学术类",
  SPORTS: "体育类",
  ARTS: "文艺类",
  VOLUNTEER: "志愿公益类",
  TECH: "科技类",
  ENTERTAINMENT: "娱乐类",
  OTHER: "其他",
};

const activityStatusMap: Record<string, string> = {
  DRAFT: "草稿",
  PENDING: "待审核",
  APPROVED: "已通过",
  REJECTED: "已驳回",
  ONGOING: "进行中",
  FINISHED: "已结束",
  CANCELED: "已取消",
};

const fetchData = async () => {
  loading.value = true;
  try {
    const res = await getRecommendations({ clubs: 8, activities: 8 });
    clubs.value = res.clubs || [];
    activities.value = res.activities || [];
  } catch (error: any) {
    ElMessage.error(error.message || "获取推荐失败");
  } finally {
    loading.value = false;
  }
};

const goSettings = () => {
  router.push("/settings");
};

const goClub = (id: number) => {
  router.push(`/clubs/${id}`);
};

const goActivity = (id: number) => {
  router.push(`/activities/${id}`);
};

onMounted(async () => {
  if (!userStore.user) {
    try {
      await userStore.fetchUserInfo();
    } catch (e) { }
  }
  fetchData();
});
</script>

<template>
  <div class="recommend-page" v-loading="loading">
    <div class="header">
      <div class="title">个性化推荐</div>
      <div class="meta">
        <template v-if="tags.length > 0">
          <span class="meta-label">我的标签：</span>
          <el-tag v-for="t in tags" :key="t" class="tag" effect="plain">{{ t }}</el-tag>
        </template>
        <template v-else>
          <el-alert
            type="info"
            show-icon
            :closable="false"
            title="你还没有设置兴趣/技能标签，推荐会基于热门与最新内容。"
          />
        </template>
      </div>
      <div class="actions">
        <el-button @click="fetchData">刷新</el-button>
        <el-button type="primary" @click="goSettings">去设置标签</el-button>
      </div>
    </div>

    <el-card shadow="never" class="block">
      <template #header>
        <div class="block-title">推荐社团</div>
      </template>
      <div v-if="clubs.length === 0" class="empty">暂无推荐社团</div>
      <div v-else class="grid">
        <el-card
          v-for="c in clubs"
          :key="c.id"
          shadow="hover"
          class="card"
          @click="goClub(c.id)"
        >
          <div class="card-title">{{ c.name }}</div>
          <div class="card-desc">{{ c.description || "暂无简介" }}</div>
          <div class="card-meta">
            <el-tag size="small" effect="plain">{{ clubTypeMap[String(c.type)] || c.type }}</el-tag>
            <span class="meta-right">成员 {{ (c as any).memberCount ?? (c as any)._count?.members ?? "-" }}</span>
          </div>
        </el-card>
      </div>
    </el-card>

    <el-card shadow="never" class="block">
      <template #header>
        <div class="block-title">推荐活动</div>
      </template>
      <div v-if="activities.length === 0" class="empty">暂无推荐活动</div>
      <div v-else class="grid">
        <el-card
          v-for="a in activities"
          :key="a.id"
          shadow="hover"
          class="card"
          @click="goActivity(a.id)"
        >
          <div class="card-title">{{ a.name }}</div>
          <div class="card-desc">{{ a.description || a.location || "暂无简介" }}</div>
          <div class="card-meta">
            <el-tag size="small" effect="plain">{{ activityStatusMap[String(a.status)] || a.status }}</el-tag>
            <span class="meta-right">{{ a.date }}</span>
          </div>
        </el-card>
      </div>
    </el-card>
  </div>
</template>

<style scoped>
.recommend-page {
  padding: 20px;
}

.header {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 12px 16px;
  align-items: start;
  margin-bottom: 16px;
}

.title {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}

.meta {
  grid-column: 1 / -1;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

.meta-label {
  color: #606266;
  font-size: 12px;
}

.tag {
  margin-right: 4px;
}

.actions {
  display: flex;
  gap: 10px;
}

.block {
  border-radius: 12px;
  margin-bottom: 16px;
}

.block-title {
  font-weight: 600;
}

.grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
}

.card {
  border-radius: 12px;
  cursor: pointer;
}

.card-title {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 8px;
  color: #303133;
}

.card-desc {
  font-size: 12px;
  color: #606266;
  line-height: 1.6;
  height: 38px;
  overflow: hidden;
}

.card-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 10px;
  font-size: 12px;
  color: #909399;
}

.meta-right {
  margin-left: 8px;
}

.empty {
  color: #909399;
  font-size: 12px;
  padding: 8px 0;
}

@media (max-width: 1200px) {
  .grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 768px) {
  .header {
    grid-template-columns: 1fr;
  }

  .actions {
    justify-content: flex-start;
  }

  .grid {
    grid-template-columns: 1fr;
  }
}
</style>
