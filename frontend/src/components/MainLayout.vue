<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue'
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
  Plus,
  UserFilled,
  Management,
  List,
  CircleCheck
} from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const activeMenu = ref('')
const searchQuery = ref('')

// 动态标题：管理员身份显示“管理系统”
const title = computed(() => {
  return userStore.user?.role === 'ADMIN' ? '青柠社团管理系统' : '青柠社团'
})

// 定义菜单条目
const menuItems = computed(() => {
  const role = userStore.user?.role
  let items = []

  if (role === 'ADMIN') {
    // 管理员菜单
    items = [
      { id: 'user-manage', label: '用户管理', icon: UserFilled, path: '/admin/users' },
      { id: 'club-manage', label: '社团管理', icon: Management, path: '/admin/clubs' },
      { id: 'activity-manage', label: '活动管理', icon: List, path: '/admin/activities' },
      { id: 'content-audit', label: '内容审批', icon: CircleCheck, path: '/admin/audit' }
    ]
  } else if (role === 'LEADER') {
    // 负责人菜单
    items = [
      { id: 'club-manage', label: '社团管理', icon: Management, path: '/leader/club' },
      { id: 'activity-manage', label: '活动管理', icon: List, path: '/leader/activities' },
      { id: 'my', label: '我的社团', icon: User, path: '/my' },
      { id: 'add-activity', label: '添加活动', icon: Plus, path: '/leader/add-activity' },
    ]
  } else {
    // 普通用户菜单
    items = [
      { id: 'home', label: '首页概览', icon: Monitor, path: '/home' },
      { id: 'clubs', label: '发现社团', icon: Search, path: '/clubs' },
      { id: 'activities', label: '社团活动', icon: Calendar, path: '/activities' },
      { id: 'my', label: '我的社团', icon: User, path: '/my' },
      { id: 'create-club', label: '创建社团', icon: Plus, path: '/create-club' }
    ]
  }

  items.push({ id: 'messages', label: '消息通知', icon: ChatDotRound, path: '/messages' })
  return items
})

onMounted(() => {
  userStore.fetchUserInfo()
})

// Watch route change to update active menu
watch(
  () => route.path,
  (path) => {
    const activeItem = menuItems.value.find(item => path.startsWith(item.path))
    activeMenu.value = activeItem ? activeItem.id : ''
  },
  { immediate: true }
)

const handleMenuClick = (item: any) => {
  activeMenu.value = item.id
  router.push(item.path)
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
        <span class="logo-text">{{ title }}</span>
      </div>
      <nav class="nav-menu">
        <div 
          v-for="item in menuItems"
          :key="item.id"
          class="nav-item" 
          :class="{ active: activeMenu === item.id }"
          @click="handleMenuClick(item)"
        >
          <el-icon><component :is="item.icon" /></el-icon>
          <span>{{ item.label }}</span>
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
