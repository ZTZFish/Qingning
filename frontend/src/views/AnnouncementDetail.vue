
<template>
  <div class="announcement-detail-container" v-loading="loading">
    <div v-if="announcement" class="detail-card">
      <div class="header">
        <h1 class="title">{{ announcement.title }}</h1>
        <div class="meta-info">
          <span class="author">
            发布者：{{ announcement.author?.realName || announcement.author?.username || '管理员' }}
          </span>
          <span class="date">发布时间：{{ announcement.createdAt }}</span>
          <el-tag v-if="announcement.pinned" type="danger" size="small" effect="dark">置顶</el-tag>
        </div>
      </div>
      
      <div class="divider"></div>
      
      <div class="content">
        {{ announcement.content }}
      </div>
      
      <div class="footer">
        <el-button @click="router.back()">返回</el-button>
      </div>
    </div>
    
    <el-empty v-else description="公告不存在或已被删除" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getAnnouncementDetail, type Announcement } from '@/api/announcement';
import { ElMessage } from 'element-plus';

const route = useRoute();
const router = useRouter();
const loading = ref(false);
const announcement = ref<Announcement | null>(null);

const fetchDetail = async () => {
  const id = Number(route.params.id);
  if (!id) return;
  
  loading.value = true;
  try {
    const res = await getAnnouncementDetail(id);
    announcement.value = res;
  } catch (error: any) {
    ElMessage.error(error.message || '获取公告详情失败');
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchDetail();
});
</script>

<style scoped>
.announcement-detail-container {
  max-width: 800px;
  margin: 20px auto;
  padding: 0 20px;
}

.detail-card {
  background: #fff;
  border-radius: 8px;
  padding: 40px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
  min-height: 400px;
}

.title {
  font-size: 24px;
  color: #303133;
  margin: 0 0 16px 0;
  text-align: center;
  font-weight: 600;
}

.meta-info {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  color: #909399;
  font-size: 14px;
  margin-bottom: 20px;
}

.divider {
  height: 1px;
  background: #ebeef5;
  margin: 20px 0;
}

.content {
  font-size: 16px;
  line-height: 1.8;
  color: #606266;
  white-space: pre-wrap; /* 保留换行符 */
  min-height: 200px;
}

.footer {
  margin-top: 40px;
  text-align: center;
}
</style>
