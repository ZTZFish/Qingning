<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import {
  User,
  Search,
  Bell,
  Setting,
  Monitor,
  Calendar,
  ChatDotRound,
  Plus
} from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const activeMenu = ref('home')
const searchQuery = ref('')

onMounted(() => {
  if (!userStore.user) {
    userStore.fetchUserInfo()
  }
})

// Watch route change to update active menu
watch(
  () => route.path,
  (path) => {
    if (path.includes('/home')) activeMenu.value = 'home'
    else if (path.includes('/clubs')) activeMenu.value = 'clubs'
    else if (path.includes('/activities')) activeMenu.value = 'activities'
    else if (path.includes('/my')) activeMenu.value = 'my'
    else if (path.includes('/messages')) activeMenu.value = 'messages'
    else if (path.includes('/create-club')) activeMenu.value = 'create-club'
    else activeMenu.value = ''
  },
  { immediate: true }
)

const handleMenuClick = (menu: string) => {
  activeMenu.value = menu
  // Map menu to route if needed
  switch (menu) {
    case 'home':
      router.push('/home')
      break
    case 'clubs':
      router.push('/clubs')
      break
    case 'activities':
      router.push('/activities')
      break
    case 'my':
      router.push('/my')
      break
    case 'messages':
      router.push('/messages')
      break
    case 'create-club':
      // 暂时跳转到创建社团页面，后续根据需求调整
      router.push('/create-club')
      break
    default:
      break
  }
}

const goToSettings = () => {
  router.push('/settings')
}

const BASE_URL = import.meta.env.VITE_API_BASE_URL.replace(/\/api\/?$/, '')

const getAvatarUrl = (path?: string) => {
  if (!path) return 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'
  if (path.startsWith('http')) return path
  return `${BASE_URL}${path}`
}
</script>

<template>
  <div class="dashboard-container">
    <!-- 侧边栏 -->
    <aside class="sidebar">
      <div class="logo-area">
        <img src="/logo.png" alt="Logo" class="logo-img" />
        <span class="logo-text">青柠社团</span>
      </div>
      <nav class="nav-menu">
        <div 
          class="nav-item" 
          :class="{ active: activeMenu === 'home' }"
          @click="handleMenuClick('home')"
        >
          <el-icon><Monitor /></el-icon>
          <span>首页概览</span>
        </div>
        <div 
          class="nav-item" 
          :class="{ active: activeMenu === 'clubs' }"
          @click="handleMenuClick('clubs')"
        >
          <el-icon><Search /></el-icon>
          <span>发现社团</span>
        </div>
        <div 
          class="nav-item" 
          :class="{ active: activeMenu === 'activities' }"
          @click="handleMenuClick('activities')"
        >
          <el-icon><Calendar /></el-icon>
          <span>社团活动</span>
        </div>
        <div 
          class="nav-item" 
          :class="{ active: activeMenu === 'my' }"
          @click="handleMenuClick('my')"
        >
          <el-icon><User /></el-icon>
          <span>我的社团</span>
        </div>
        <div 
          class="nav-item" 
          :class="{ active: activeMenu === 'create-club' }"
          @click="handleMenuClick('create-club')"
        >
          <el-icon><Plus /></el-icon>
          <span>创建社团</span>
        </div>
        <div 
          class="nav-item" 
          :class="{ active: activeMenu === 'messages' }"
          @click="handleMenuClick('messages')"
        >
          <el-icon><ChatDotRound /></el-icon>
          <span>消息通知</span>
        </div>
      </nav>

      <div class="user-profile">
        <el-avatar :size="40" :src="getAvatarUrl(userStore.user?.avatar || undefined)" />
        <div class="user-info">
          <span class="username">{{ userStore.user?.username || '未登录' }}</span>
          <span class="role">{{ userStore.user?.role === 'ADMIN' ? '管理员' : userStore.user?.role === 'LEADER' ? '社团负责人' : '普通用户' }}</span>
        </div>
        <el-icon class="settings-icon" @click="goToSettings"><Setting /></el-icon>
      </div>
    </aside>

    <!-- 主内容区 -->
    <main class="main-content">
      <!-- 顶部栏 -->
      <header class="top-bar">
        <div class="search-wrapper">
          <el-input
            v-model="searchQuery"
            placeholder="搜索社团或活动..."
            :prefix-icon="Search"
            class="search-input"
          />
        </div>
        <div class="actions">
          <el-button circle>
            <el-icon><Bell /></el-icon>
          </el-button>
        </div>
      </header>

      <div class="content-scroll">
        <router-view />
      </div>
    </main>
  </div>
</template>

<style scoped>
.dashboard-container {
  display: flex;
  height: 100vh;
  background-color: #f5f7fa;
  font-family: 'PingFang SC', 'Helvetica Neue', Helvetica, 'Microsoft YaHei', Arial, sans-serif;
}

/* Sidebar */
.sidebar {
  width: 260px;
  background-color: #ffffff;
  border-right: 1px solid #e6e6e6;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
}

.logo-area {
  height: 80px;
  display: flex;
  align-items: center;
  padding: 0 24px;
  gap: 12px;
}

.logo-img {
  width: 40px;
  height: 40px;
  object-fit: contain;
}

.logo-text {
  font-size: 20px;
  font-weight: bold;
  color: #00A69A;
}

.nav-menu {
  flex: 1;
  padding: 24px 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.nav-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border-radius: 12px;
  cursor: pointer;
  color: #606266;
  transition: all 0.3s;
  font-weight: 500;
}

.nav-item .el-icon {
  margin-right: 12px;
  font-size: 20px;
}

.nav-item:hover {
  background-color: #f0f9f8;
  color: #00A69A;
}

.nav-item.active {
  background-color: #e0f2f1;
  color: #00A69A;
}

.user-profile {
  padding: 24px;
  border-top: 1px solid #f0f0f0;
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.username {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
}

.role {
  font-size: 12px;
  color: #909399;
}

.settings-icon {
  color: #909399;
  cursor: pointer;
}

/* Main Content */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.top-bar {
  height: 64px;
  background-color: #ffffff;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 32px;
}

.search-input {
  width: 300px;
}

.search-input :deep(.el-input__wrapper) {
  border-radius: 20px;
  background-color: #f5f7fa;
  box-shadow: none;
}

.content-scroll {
  flex: 1;
  overflow-y: auto;
  padding: 32px;
}
</style>
