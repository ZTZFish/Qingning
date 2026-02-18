<script setup lang="ts">
import { computed } from 'vue'
import { Calendar, User, ArrowRight } from '@element-plus/icons-vue'

// 测试组件：数据硬编码
const mockClub = {
  id: 1,
  name: '青柠摄影协会',
  description: '捕捉生活中的每一刻美好。我们定期组织外拍活动、摄影讲座和后期处理教程，欢迎所有热爱摄影的同学加入！',
  createdAt: '2024-01-01T00:00:00.000Z',
  leader: {
    username: '张摄影'
  }
}

// 格式化日期
const formattedDate = computed(() => {
  const date = new Date(mockClub.createdAt)
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`
})

// 截断描述
const truncatedDescription = computed(() => {
  const desc = mockClub.description
  return desc.length > 50
    ? desc.slice(0, 50) + '...'
    : desc
})

const handleClick = () => {
  console.log('点击了测试卡片:', mockClub.name)
}
</script>

<template>
  <el-card class="club-card" :body-style="{ padding: '0px' }" shadow="hover" @click="handleClick">
    <div class="card-image-wrapper">
      <div class="card-cover" :style="{ background: `linear-gradient(135deg, #a5d6a7 0%, #4caf50 100%)` }">
        <span class="club-badge">测试组件</span>
      </div>
    </div>
    
    <div class="card-content">
      <div class="club-info">
        <h3 class="club-name">{{ mockClub.name }}</h3>
        <p class="club-desc">{{ truncatedDescription }}</p>
      </div>
      
      <div class="club-meta">
        <div class="meta-item">
          <el-icon><User /></el-icon>
          <span>{{ mockClub.leader.username }}</span>
        </div>
        <div class="meta-item">
          <el-icon><Calendar /></el-icon>
          <span>{{ formattedDate }} 成立</span>
        </div>
      </div>
      
      <div class="card-footer">
        <el-button type="primary" link class="detail-btn">
          查看详情 <el-icon class="el-icon--right"><ArrowRight /></el-icon>
        </el-button>
      </div>
    </div>
  </el-card>
</template>

<style scoped>
.club-card {
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid #f0f0f0;
  cursor: pointer;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.club-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.08) !important;
}

.card-image-wrapper {
  position: relative;
  height: 140px;
  width: 100%;
}

.card-cover {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.club-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(4px);
  color: #fff;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.card-content {
  padding: 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.club-info {
  margin-bottom: 16px;
  flex: 1;
}

.club-name {
  margin: 0 0 8px 0;
  font-size: 20px;
  font-weight: 600;
  color: #333;
  line-height: 1.4;
}

.club-desc {
  margin: 0;
  font-size: 14px;
  color: #666;
  line-height: 1.6;
}

.club-meta {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
  padding-top: 16px;
  border-top: 1px dashed #eee;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #888;
}

.meta-item .el-icon {
  font-size: 14px;
}

.card-footer {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.detail-btn {
  font-weight: 600;
  padding: 0;
  transition: all 0.3s;
}

.detail-btn:hover {
  transform: translateX(4px);
}
</style>
