<template>
  <div class="user-settings">
    <el-card class="settings-card">
      <template #header>
        <div class="card-header">
          <span>个人设置</span>
        </div>
      </template>

      <el-tabs v-model="activeTab">
        <!-- 基本信息 -->
        <el-tab-pane label="基本信息" name="basic">
          <el-form :model="basicForm" label-width="80px">
            <el-form-item label="头像">
               <div class="avatar-edit-container">
                 <el-upload
                   class="avatar-uploader"
                   action="#"
                   :show-file-list="false"
                   :http-request="handleAvatarUpload"
                   :before-upload="beforeAvatarUpload"
                 >
                   <img v-if="basicForm.avatar" :src="getAvatarUrl(basicForm.avatar)" class="avatar" />
                   <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
                 </el-upload>
                 <div class="avatar-tip">点击上传头像 (支持 jpg, png, gif)</div>
               </div>
            </el-form-item>
            <el-form-item label="用户名">
              <el-input v-model="basicForm.username" />
            </el-form-item>
            <el-form-item label="角色">
              <el-tag>{{ roleText }}</el-tag>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleUpdateProfile">保存修改</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <!-- 安全设置 -->
        <el-tab-pane label="安全设置" name="security">
          <el-form :model="emailForm" label-width="80px">
            <el-form-item label="当前邮箱">
              <el-input v-model="currentEmail" disabled />
            </el-form-item>
            <el-form-item label="新邮箱">
              <el-input v-model="emailForm.email" placeholder="请输入新邮箱" />
            </el-form-item>
            <el-form-item label="当前密码">
              <el-input v-model="emailForm.password" type="password" placeholder="验证当前密码" show-password />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleUpdateEmail">确认修改</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>

      <div class="logout-area">
        <el-button type="danger" plain @click="handleLogout">退出登录</el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { getUserInfo, updateUserInfo, updateUserEmail, uploadAvatar } from '@/api/user'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import type { User } from '@/types'

const router = useRouter()
const activeTab = ref('basic')
const currentUser = ref<User | null>(null)

const basicForm = ref({
  username: '',
  avatar: ''
})

const emailForm = ref({
  email: '',
  password: ''
})

const currentEmail = computed(() => currentUser.value?.email || '')
const roleText = computed(() => {
  const role = currentUser.value?.role
  if (role === 'ADMIN') return '管理员'
  if (role === 'LEADER') return '社团负责人'
  return '普通用户'
})

const fetchUser = async () => {
  try {
    const res = await getUserInfo()
    if (res) {
      currentUser.value = res
      basicForm.value.username = res.username
      basicForm.value.avatar = res.avatar || ''
    }
  } catch (error) {
    console.error(error)
  }
}

const BASE_URL = import.meta.env.VITE_API_BASE_URL.replace(/\/api\/?$/, '')

const getAvatarUrl = (path: string) => {
  if (!path) return ''
  if (path.startsWith('http')) return path
  return `${BASE_URL}${path}`
}

const beforeAvatarUpload = (rawFile: any) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
  if (!allowedTypes.includes(rawFile.type)) {
    ElMessage.error('头像图片必须是 JPG/PNG/GIF/WEBP 格式！')
    return false
  } else if (rawFile.size / 1024 / 1024 > 5) {
    ElMessage.error('头像图片体积不能超过 5MB！')
    return false
  }
  return true
}

const handleAvatarUpload = async (options: any) => {
  const formData = new FormData()
  formData.append('avatar', options.file)
  try {
    const res = await uploadAvatar(formData)
    if (res && res.avatar) {
      basicForm.value.avatar = res.avatar
      if (currentUser.value) {
        currentUser.value.avatar = res.avatar
      }
      ElMessage.success('头像上传成功')
    }
  } catch (error: any) {
    console.error('Avatar upload error:', error)
    const msg = error.response?.data?.message || error.message || '上传失败'
    ElMessage.error(`头像上传失败: ${msg}`)
  }
}

const handleUpdateProfile = async () => {
  try {
    await updateUserInfo(basicForm.value)
    ElMessage.success('用户信息更新成功')
    await fetchUser()
    // 触发一个自定义事件或者重新加载页面来更新 MainLayout 里的用户信息可能会更复杂，
    // 简单的方式是刷新页面，或者使用全局状态管理 (Pinia)。
    // 这里暂时不做复杂处理，用户手动刷新后 MainLayout 会更新。
    // 为了更好的体验，我们可以 reload window
    setTimeout(() => {
      window.location.reload()
    }, 500)
  } catch (error: any) {
    ElMessage.error(error.message || '更新失败')
  }
}

const handleUpdateEmail = async () => {
  if (!emailForm.value.email || !emailForm.value.password) {
    return ElMessage.warning('请填写完整信息')
  }

  try {
    await updateUserEmail(emailForm.value)
    ElMessage.success('邮箱更新成功')
    emailForm.value.email = ''
    emailForm.value.password = ''
    await fetchUser()
  } catch (error: any) {
    ElMessage.error(error.message || '更新失败')
  }
}

const handleLogout = () => {
  ElMessageBox.confirm('确定要退出登录吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    localStorage.removeItem('token')
    router.push('/login')
    ElMessage.success('已退出登录')
  })
}

onMounted(() => {
  fetchUser()
})
</script>

<style scoped>
.user-settings {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.card-header {
  font-weight: bold;
}

.avatar-edit-container {
  display: flex;
  flex-direction: column;
}

.avatar-uploader .avatar {
  width: 100px;
  height: 100px;
  display: block;
  border-radius: 50%;
  object-fit: cover;
}

.avatar-uploader :deep(.el-upload) {
  border: 1px dashed var(--el-border-color);
  border-radius: 50%;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader :deep(.el-upload:hover) {
  border-color: var(--el-color-primary);
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  text-align: center;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.avatar-tip {
  font-size: 12px;
  color: #999;
  margin-top: 5px;
}

.logout-area {
  margin-top: 40px;
  border-top: 1px solid #eee;
  padding-top: 20px;
  text-align: center;
}
</style>
