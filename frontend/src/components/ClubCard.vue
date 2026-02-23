<script setup lang="ts">
import { computed } from 'vue'
import { Calendar, User, ArrowRight } from '@element-plus/icons-vue'
import { type Club, ClubType } from '@/types'

const props = defineProps<{
  club: Club
}>()

const emit = defineEmits<{
  (e: 'click', club: Club): void
}>()

// 格式化日期
const formattedDate = computed(() => {
  const date = new Date(props.club.createdAt)
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`
})

// 截断描述
const truncatedDescription = computed(() => {
  if (!props.club.description) return '暂无简介'
  return props.club.description.length > 50
    ? props.club.description.slice(0, 50) + '...'
    : props.club.description
})

// 社团类型映射
const clubTypeMap: Record<string, { label: string; color: string }> = {
  [ClubType.ACADEMIC]: { label: '学术', color: '#409EFF' },
  [ClubType.SPORTS]: { label: '体育', color: '#E6A23C' },
  [ClubType.ARTS]: { label: '文艺', color: '#F56C6C' },
  [ClubType.VOLUNTEER]: { label: '公益', color: '#67C23A' },
  [ClubType.TECH]: { label: '科技', color: '#909399' },
  [ClubType.ENTERTAINMENT]: { label: '娱乐', color: '#E91E63' },
  [ClubType.OTHER]: { label: '其他', color: '#606266' },
}

const clubTypeInfo = computed(() => {
  const type = props.club.type || ClubType.OTHER
  return clubTypeMap[type] || { label: '未知', color: '#909399' }
})

// 随机背景渐变 (当没有封面图时使用)
const randomGradient = computed(() => {
  const gradients = [
    'linear-gradient(135deg, #a5d6a7 0%, #4caf50 100%)',
    'linear-gradient(135deg, #42a5f5 0%, #1e88e5 100%)',
    'linear-gradient(135deg, #ef5350 0%, #d32f2f 100%)',
    'linear-gradient(135deg, #ffca28 0%, #ff6f00 100%)',
    'linear-gradient(135deg, #ab47bc 0%, #7b1fa2 100%)',
  ]
  return gradients[props.club.id % gradients.length]
})
</script>

<template>
  <el-card class="club-card" :body-style="{ padding: '0px' }" shadow="hover" @click="emit('click', club)">
    <div class="card-image-wrapper">
      <template v-if="club.coverImage">
        <img :src="club.coverImage" class="club-cover-img" alt="社团封面" />
      </template>
      <template v-else>
        <div class="card-cover" :style="{ background: randomGradient }">
          <span class="club-placeholder-text">{{ club.name.slice(0, 2) }}</span>
        </div>
      </template>
      
      <!-- 类型徽章 -->
      <div class="club-badge" :style="{ backgroundColor: clubTypeInfo.color }">
        {{ clubTypeInfo.label }}
      </div>
    </div>
    
    <div class="card-content">
      <div class="club-info">
        <h3 class="club-name">{{ club.name }}</h3>
        <p class="club-desc">{{ truncatedDescription }}</p>
      </div>
      
      <div class="club-meta">
        <div class="meta-row">
          <div class="meta-item">
            <el-icon><User /></el-icon>
            <span>{{ club._count?.members || 0 }} 人</span>
          </div>
          <div class="meta-item">
            <el-icon><Calendar /></el-icon>
            <span>{{ formattedDate }}</span>
          </div>
        </div>
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
  display: flex;
  flex-direction: column;
}

.club-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.08) !important;
}

.card-image-wrapper {
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
}

.club-cover-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card-cover {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.club-placeholder-text {
  font-size: 32px;
  font-weight: bold;
  color: rgba(255, 255, 255, 0.9);
}

.club-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  color: #fff;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 10;
}

.card-content {
  box-sizing: border-box;
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
  font-size: 18px;
  font-weight: 600;
  color: #333;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.club-desc {
  margin: 0;
  font-size: 13px;
  color: #666;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.club-meta {
  padding-top: 16px;
  border-top: 1px dashed #eee;
}

.meta-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #888;
}

.meta-item .el-icon {
  font-size: 14px;
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