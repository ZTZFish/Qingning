<script setup lang="ts">
import { ref } from 'vue'
import {
  User,
  Monitor,
  Calendar,
  Location,
  ChatDotRound,
  ArrowRight
} from '@element-plus/icons-vue'
import ClubCard from '@/components/ClubCard.vue'
import { type Club, Status, Role, ClubType } from '@/types'

// 模拟数据
const banners = [
  { id: 1, title: '2024年春季社团招新开始啦！', sub: '寻找志同道合的伙伴', color: '#00A69A' },
  { id: 2, title: '摄影协会：光影艺术展', sub: '本周五下午3点，图书馆一楼', color: '#FF7F50' },
  { id: 3, title: '计算机社：AI技术分享会', sub: '探索人工智能的无限可能', color: '#409EFF' },
]

const activities = [
  {
    id: 1,
    title: '校园马拉松',
    date: '2024-03-20',
    location: '操场',
    club: '跑步协会',
    image: 'linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%)'
  },
  {
    id: 2,
    title: '读书分享会',
    date: '2024-03-22',
    location: '图书馆',
    club: '文学社',
    image: 'linear-gradient(120deg, #d4fc79 0%, #96e6a1 100%)'
  },
  {
    id: 3,
    title: '吉他入门课',
    date: '2024-03-25',
    location: '活动中心',
    club: '吉他社',
    image: 'linear-gradient(120deg, #fccb90 0%, #d57eeb 100%)'
  },
]

const announcements = [
  { id: 1, title: '关于社团活动场地申请的通知', date: '2024-03-15', tag: '重要' },
  { id: 2, title: '2023年度优秀社团评选结果公示', date: '2024-03-10', tag: '公示' },
  { id: 3, title: '新学期社团负责人会议通知', date: '2024-03-05', tag: '会议' },
]

const clubs: Club[] = [
  {
    id: 1,
    name: '青柠摄影协会',
    description: '捕捉生活中的每一刻美好。我们定期组织外拍活动、摄影讲座和后期处理教程。',
    leaderId: 101,
    status: Status.APPROVED,
    createdAt: '2023-09-01T00:00:00.000Z',
    updatedAt: '2023-09-01T00:00:00.000Z',
    type: ClubType.ARTS,
    coverImage: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
    _count: { members: 58 },
    leader: {
      id: 101,
      username: '张摄影',
      email: 'zhang@example.com',
      role: Role.LEADER
    }
  },
  {
    id: 2,
    name: '极客计算机社',
    description: '探索代码的奥秘，分享最新的技术动态。无论你是小白还是大神，都欢迎加入！',
    leaderId: 102,
    status: Status.APPROVED,
    createdAt: '2023-09-05T00:00:00.000Z',
    updatedAt: '2023-09-05T00:00:00.000Z',
    type: ClubType.TECH,
    coverImage: null,
    _count: { members: 120 },
    leader: {
      id: 102,
      username: '李代码',
      email: 'li@example.com',
      role: Role.LEADER
    }
  },
  {
    id: 3,
    name: '羽毛球协会',
    description: '挥洒汗水，强身健体。每周定期组织训练和比赛，欢迎热爱运动的你。',
    leaderId: 103,
    status: Status.APPROVED,
    createdAt: '2023-09-10T00:00:00.000Z',
    updatedAt: '2023-09-10T00:00:00.000Z',
    type: ClubType.SPORTS,
    coverImage: 'https://images.unsplash.com/photo-1626224583764-84786c719794?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
    _count: { members: 85 },
    leader: {
      id: 103,
      username: '王运动',
      email: 'wang@example.com',
      role: Role.LEADER
    }
  },
  {
    id: 4,
    name: '话剧社',
    description: '体验不一样的人生，感受舞台的魅力。我们需要演员、编剧、导演和幕后人员。',
    leaderId: 104,
    status: Status.APPROVED,
    createdAt: '2023-09-15T00:00:00.000Z',
    updatedAt: '2023-09-15T00:00:00.000Z',
    type: ClubType.ARTS,
    coverImage: null,
    _count: { members: 42 },
    leader: {
      id: 104,
      username: '赵戏剧',
      email: 'zhao@example.com',
      role: Role.LEADER
    }
  },
]

const handleClubClick = (club: any) => {
  console.log('Clicked club:', club)
}
</script>

<template>
  <div class="home-container">
    <!-- 轮播图 -->
    <div class="banner-section">
      <el-carousel trigger="click" :interval="5000" type="card">
        <el-carousel-item v-for="item in banners" :key="item.id">
          <div class="banner-card" :style="{ backgroundColor: item.color }">
            <div class="banner-content">
              <h2>{{ item.title }}</h2>
              <p>{{ item.sub }}</p>
              <el-button type="primary" plain class="banner-btn">查看详情</el-button>
            </div>
            <div class="banner-decoration"></div>
          </div>
        </el-carousel-item>
      </el-carousel>
    </div>

    <div class="grid-layout">
      <!-- 左侧主要内容 -->
      <div class="left-column">
        <!-- 推荐社团 -->
        <div class="section-header">
          <h3>推荐社团</h3>
          <el-button link>查看全部 <el-icon><ArrowRight /></el-icon></el-button>
        </div>
        <div class="clubs-grid">
          <div v-for="club in clubs" :key="club.id" class="club-wrapper">
            <ClubCard :club="club" @click="handleClubClick" />
          </div>
        </div>

        <!-- 最新活动 -->
        <div class="section-header mt-8">
          <h3>最新活动</h3>
          <el-button link>更多活动 <el-icon><ArrowRight /></el-icon></el-button>
        </div>
        <div class="activities-scroll">
          <div v-for="activity in activities" :key="activity.id" class="activity-card">
            <div class="activity-image" :style="{ background: activity.image }">
              <span class="activity-tag">{{ activity.club }}</span>
            </div>
            <div class="activity-info">
              <h4>{{ activity.title }}</h4>
              <div class="info-row">
                <el-icon><Calendar /></el-icon> <span>{{ activity.date }}</span>
              </div>
              <div class="info-row">
                <el-icon><Location /></el-icon> <span>{{ activity.location }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧边栏 -->
      <div class="right-column">
        <!-- 公告栏 -->
        <div class="widget-card">
          <div class="widget-header">
            <h3>公告通知</h3>
          </div>
          <div class="announcement-list">
            <div v-for="item in announcements" :key="item.id" class="announcement-item">
              <div class="ann-tag">{{ item.tag }}</div>
              <div class="ann-content">
                <p class="ann-title">{{ item.title }}</p>
                <span class="ann-date">{{ item.date }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 快捷入口 -->
        <div class="widget-card mt-6">
          <div class="widget-header">
            <h3>快捷入口</h3>
          </div>
          <div class="quick-links">
            <div class="quick-link-item">
              <div class="icon-box blue"><el-icon><Monitor /></el-icon></div>
              <span>活动签到</span>
            </div>
            <div class="quick-link-item">
              <div class="icon-box green"><el-icon><User /></el-icon></div>
              <span>加入申请</span>
            </div>
            <div class="quick-link-item">
              <div class="icon-box purple"><el-icon><ChatDotRound /></el-icon></div>
              <span>我的消息</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Banner */
.banner-section {
  margin-bottom: 32px;
}

.banner-card {
  box-sizing: border-box;
  height: 100%;
  border-radius: 16px;
  padding: 40px;
  color: #fff;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.banner-content h2 {
  font-size: 28px;
  margin-bottom: 12px;
}

.banner-content p {
  font-size: 16px;
  opacity: 0.9;
  margin-bottom: 24px;
}

.banner-btn {
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.4);
  color: #fff;
}

/* Grid Layout */
.grid-layout {
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 24px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.section-header h3 {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
  margin: 0;
  border-left: 4px solid #00A69A;
  padding-left: 12px;
}

.clubs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.mt-8 {
  margin-top: 32px;
}

.activities-scroll {
  display: flex;
  overflow-x: auto;
  gap: 16px;
  padding-bottom: 16px;
}

.activity-card {
  flex: 0 0 240px;
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
  cursor: pointer;
  transition: all 0.3s;
}

.activity-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.activity-image {
  height: 120px;
  position: relative;
}

.activity-tag {
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgba(0, 0, 0, 0.6);
  color: #fff;
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 4px;
}

.activity-info {
  padding: 12px;
}

.activity-info h4 {
  font-size: 16px;
  margin: 0 0 8px 0;
  color: #303133;
}

.info-row {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #909399;
  margin-bottom: 4px;
}

/* Widget Card */
.widget-card {
  background: #fff;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
}

.widget-header {
  margin-bottom: 16px;
}

.widget-header h3 {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin: 0;
}

.announcement-item {
  display: flex;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid #f5f7fa;
}

.announcement-item:last-child {
  border-bottom: none;
}

.ann-tag {
  background: #e0f2f1;
  color: #00A69A;
  font-size: 12px;
  padding: 2px 6px;
  border-radius: 4px;
  height: fit-content;
}

.ann-content {
  flex: 1;
}

.ann-title {
  font-size: 14px;
  color: #606266;
  margin: 0 0 4px 0;
  line-height: 1.4;
  cursor: pointer;
}

.ann-title:hover {
  color: #00A69A;
}

.ann-date {
  font-size: 12px;
  color: #999;
}

.mt-6 {
  margin-top: 24px;
}

.quick-links {
  display: flex;
  justify-content: space-between;
}

.quick-link-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.icon-box {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  transition: all 0.3s;
}

.icon-box.blue {
  background: #ecf5ff;
  color: #409eff;
}

.icon-box.green {
  background: #f0f9eb;
  color: #67c23a;
}

.icon-box.purple {
  background: #f4f4f5;
  color: #909399;
}

.quick-link-item:hover .icon-box {
  transform: scale(1.1);
}

.quick-link-item span {
  font-size: 12px;
  color: #606266;
}
</style>
