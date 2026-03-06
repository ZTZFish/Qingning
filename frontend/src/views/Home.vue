<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  User,
  Monitor,
  Calendar,
  Location,
  ChatDotRound,
  ArrowRight
} from '@element-plus/icons-vue'
import ClubCard from '@/components/ClubCard.vue'
import { type Club } from '@/types'
import { ElMessage } from 'element-plus'
import { getClubs } from '@/api/club'
import { getActivities } from '@/api/activity'
import { getAnnouncements } from '@/api/announcement'

const router = useRouter()
const BASE_URL = import.meta.env.VITE_API_BASE_URL.replace(/\/api\/?$/, '')
// 模拟数据
const banners = [
  { id: 1, url: `${BASE_URL}/uploads/banners/banner1.jpg`, path: '/announcements/1' },
  { id: 2, url: `${BASE_URL}/uploads/activities/47-1772550054935-978336642.png`, path: '/activities/2' },
  { id: 3, url: `${BASE_URL}/uploads/activities/33-1772800945555-587100633.jpg`, path: '/activities/6' },
]

const latestActivities = ref<any[]>([])

const announcements = ref<any[]>([])

const clubs = ref<Club[]>([])
const loading = ref(false)



const fetchAnnouncements = async () => {
  try {
    const res = await getAnnouncements({ page: 1, pageSize: 5 })
    announcements.value = res.list.map(item => ({
      ...item,
      date: item.createdAt.split(' ')[0], // 只显示日期部分
      tag: item.pinned ? '置顶' : '公告'
    }))
  } catch (error) {
    console.error('获取公告失败', error)
  }
}

const getFullUrl = (path?: string) => {
  if (!path) return ''
  if (path.startsWith('http')) return path
  return `${BASE_URL}${path}`
}

const fetchClubs = async () => {
  loading.value = true
  try {
    const res = await getClubs({ page: 1, pageSize: 6, sort: 'memberCount' })
    clubs.value = res.list
  } catch (error: any) {
    ElMessage.error(error.message || '获取社团列表失败')
  } finally {
    loading.value = false
  }
}

const fetchActivities = async () => {
  try {
    const res = await getActivities({ page: 1, pageSize: 6, statuses: 'APPROVED,ONGOING' })
    latestActivities.value = res.list || []
  } catch (error: any) {
    // 静默处理
  }
}

onMounted(() => {
  fetchClubs()
  fetchActivities()
  fetchAnnouncements()
})

const handleClubClick = (club: any) => {
  router.push(`/clubs/${club.id}`)
}

const handleViewAllClubs = () => {
  router.push('/clubs')
}

const handleMoreActivities = () => {
  router.push('/activities')
}

const handleActivityClick = (activity: any) => {
  router.push(`/activities/${activity.id}`)
}

</script>

<template>
  <div class="home-container">
    <!-- 轮播图 -->
    <div class="banner-section">
      <el-carousel trigger="click" :interval="5000" type="card" height="400px">
        <el-carousel-item v-for="item in banners" :key="item.id">
          <div 
            class="banner-card" 
            :style="{ backgroundImage: `url(${item.url})` }"
            @click="router.push(item.path)"
            style="cursor: pointer"
          >
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
          <el-button link @click="handleViewAllClubs">查看全部 <el-icon>
              <ArrowRight />
            </el-icon></el-button>
        </div>
        <div class="clubs-grid" v-loading="loading">
          <div v-for="club in clubs" :key="club.id" class="club-wrapper">
            <ClubCard :club="club" @click="handleClubClick" />
          </div>
        </div>

        <!-- 最新活动 -->
        <div class="section-header mt-8">
          <h3>最新活动</h3>
          <el-button link @click="handleMoreActivities">更多活动 <el-icon>
              <ArrowRight />
            </el-icon></el-button>
        </div>
        <div class="activities-scroll">
          <div
            v-for="activity in latestActivities"
            :key="activity.id"
            class="activity-card"
            @click="handleActivityClick(activity)"
          >
            <div
              class="activity-image"
              :style="activity.coverImage ? { backgroundImage: `url(${getFullUrl(activity.coverImage)})` } : { background: '#f5f7fa' }"
            >
              <span class="activity-tag">{{ activity.club?.name }}</span>
            </div>
            <div class="activity-info">
              <h4>{{ activity.name }}</h4>
              <div class="info-row">
                <el-icon>
                  <Calendar />
                </el-icon> <span>{{ activity.date }}</span>
              </div>
              <div class="info-row">
                <el-icon>
                  <Location />
                </el-icon> <span>{{ activity.location || '待定' }}</span>
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
            <div
              v-for="ann in announcements"
              :key="ann.id"
              class="announcement-item"
              @click="router.push(`/announcements/${ann.id}`)"
              style="cursor: pointer"
            >
              <div class="ann-tag" :class="{ 'pinned': ann.pinned }">{{ ann.tag || '公告' }}</div>
              <div class="ann-content">
                <div class="ann-title">{{ ann.title }}</div>
                <div class="ann-date">{{ ann.date }}</div>
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
              <div class="icon-box blue"><el-icon>
                  <Monitor />
                </el-icon></div>
              <span>活动签到</span>
            </div>
            <div class="quick-link-item">
              <div class="icon-box green"><el-icon>
                  <User />
                </el-icon></div>
              <span>加入申请</span>
            </div>
            <div class="quick-link-item">
              <div class="icon-box purple"><el-icon>
                  <ChatDotRound />
                </el-icon></div>
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
  position: relative;
  overflow: hidden;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
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
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
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
