<script setup lang="ts">
import { ref, reactive, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { User, Lock, Message, Message as MessageIcon, CircleCheck, Male, Female, Postcard, Avatar } from '@element-plus/icons-vue'
import { login, register, sendCode, resetPassword } from '@/api/user'
import { Role, Sex } from '@/types'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()
const isLogin = ref(true)
const isForgotPassword = ref(false)
const loading = ref(false)
const codeLoading = ref(false)
const countdown = ref(0)
let timer: any = null

const loginForm = reactive({
  username: '',
  password: '',
  role: Role.USER
})

const registerForm = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  code: '',
  role: Role.USER,
  realName: '',
  sex: Sex.MALE,
  StudentId: ''
})

const forgotPasswordForm = reactive({
  email: '',
  code: '',
  newPassword: '',
  confirmPassword: ''
})

const startCountdown = () => {
  countdown.value = 60
  timer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(timer)
    }
  }, 1000)
}

onUnmounted(() => {
  if (timer) clearInterval(timer)
})

const handleSendCode = async (email: string, type: string) => {
  if (!email) {
    ElMessage.warning('请先输入邮箱')
    return
  }
  const emailReg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
  if (!emailReg.test(email)) {
    ElMessage.warning('请输入正确的邮箱格式')
    return
  }

  codeLoading.value = true
  try {
    await sendCode(email)
    ElMessage.success('验证码已发送至您的邮箱')
    startCountdown()
  } catch (error: any) {
    ElMessage.error(error.message || '发送失败')
  } finally {
    codeLoading.value = false
  }
}

const handleLogin = async () => {
  if (!loginForm.username || !loginForm.password) {
    ElMessage.warning('请输入用户名和密码')
    return
  }

  loading.value = true
  try {
    const res = await login({
      username: loginForm.username,
      password: loginForm.password,
      role: loginForm.role
    })

    // 保存 token 和用户信息
    userStore.setToken(res.token)
    userStore.user = res.user // 直接更新 store 中的用户信息，避免跳转后再次请求
    // 为了兼容可能还在使用 localStorage.getItem('user') 的代码（如果有），也可以保留下面这行，
    // 但建议逐步迁移到使用 userStore
    localStorage.setItem('user', JSON.stringify(res.user))

    ElMessage.success('登录成功')

    // 根据角色跳转不同页面 (此处先预留跳转逻辑)
    if (res.user.role === Role.ADMIN) {
      // router.push('/admin/dashboard')
      // ElMessage.info('管理员后台建设中...')
      // 暂时都跳转到首页
      router.push("admin/users")
    } else if (res.user.role === Role.LEADER) {
      // router.push('/leader/dashboard')
      // ElMessage.info('社团负责人中心建设中...')
      router.push("leader/club")
    } else {
      router.push("/home")
    }
  } catch (error: any) {
    ElMessage.error(error.message || '登录失败')
  } finally {
    loading.value = false
  }
}

const handleRegister = async () => {
  if (registerForm.password !== registerForm.confirmPassword) {
    ElMessage.error('两次输入的密码不一致')
    return
  }
  if (!registerForm.realName) {
    ElMessage.error('请输入真实姓名')
    return
  }
  if (!registerForm.StudentId) {
    ElMessage.error('请输入学号')
    return
  }
  if (!/^\d{8}$/.test(registerForm.StudentId)) {
    ElMessage.error('学号必须是8位数字')
    return
  }

  loading.value = true
  try {
    await register({
      username: registerForm.username,
      email: registerForm.email,
      password: registerForm.password,
      code: registerForm.code,
      role: registerForm.role,
      realName: registerForm.realName,
      sex: registerForm.sex,
      studentId: registerForm.StudentId
    })

    ElMessage.success('注册成功，请登录')
    isLogin.value = true
  } catch (error: any) {
    ElMessage.error(error.message || '注册失败')
  } finally {
    loading.value = false
  }
}

const handleResetPassword = async () => {
  if (forgotPasswordForm.newPassword !== forgotPasswordForm.confirmPassword) {
    ElMessage.error('两次输入的密码不一致')
    return
  }

  loading.value = true
  try {
    await resetPassword({
      email: forgotPasswordForm.email,
      code: forgotPasswordForm.code,
      newPassword: forgotPasswordForm.newPassword
    })

    ElMessage.success('密码重置成功，请登录')
    isForgotPassword.value = false
    isLogin.value = true
  } catch (error: any) {
    ElMessage.error(error.message || '重置失败')
  } finally {
    loading.value = false
  }
}

const toggleMode = () => {
  isLogin.value = !isLogin.value
}

const toggleForgotPassword = () => {
  isForgotPassword.value = !isForgotPassword.value
  isLogin.value = !isForgotPassword.value
}
</script>

<template>
  <div class="auth-container">
    <div class="auth-card">
      <div class="auth-header">
        <div class="auth-title">
          {{ isForgotPassword ? '重置密码' : isLogin ? '欢迎回来' : '创建账号' }}
        </div>
        <div class="auth-subtitle">Qingning Club Management System</div>
      </div>

      <!-- 忘记密码表单 -->
      <el-form v-if="isForgotPassword" :model="forgotPasswordForm" class="auth-form" @keyup.enter="handleResetPassword">
        <el-form-item>
          <el-input v-model="forgotPasswordForm.email" placeholder="邮箱" :prefix-icon="Message" />
        </el-form-item>
        <el-form-item class="code-item">
          <div class="code-input-wrapper">
            <el-input v-model="forgotPasswordForm.code" placeholder="验证码" :prefix-icon="CircleCheck" />
            <el-button
              class="send-code-link"
              :disabled="countdown > 0 || codeLoading"
              link
              type="primary"
              @click="handleSendCode(forgotPasswordForm.email, 'reset_password')"
            >
              {{ countdown > 0 ? `${countdown}s` : '获取验证码' }}
            </el-button>
          </div>
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="forgotPasswordForm.newPassword"
            type="password"
            placeholder="新密码"
            :prefix-icon="Lock"
            show-password
          />
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="forgotPasswordForm.confirmPassword"
            type="password"
            placeholder="确认新密码"
            :prefix-icon="Lock"
            show-password
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="submit-btn" :loading="loading" @click="handleResetPassword">
            重置密码
          </el-button>
        </el-form-item>
        <div class="auth-footer">
          <el-link type="primary" :underline="false" @click="toggleForgotPassword">
            返回登录
          </el-link>
        </div>
      </el-form>

      <!-- 登录表单 -->
      <el-form v-else-if="isLogin" :model="loginForm" class="auth-form" @keyup.enter="handleLogin">
        <el-form-item>
          <el-input v-model="loginForm.username" placeholder="用户名" :prefix-icon="User" />
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="密码"
            :prefix-icon="Lock"
            show-password
          />
        </el-form-item>
        <el-form-item>
          <div style="display: flex; justify-content: flex-end; width: 100%;">
            <el-link type="primary" :underline="false" @click="toggleForgotPassword" style="font-size: 12px;">
              忘记密码？
            </el-link>
          </div>
        </el-form-item>
        <el-form-item label="登录角色">
          <el-radio-group v-model="loginForm.role">
            <el-radio :label="Role.USER">普通用户</el-radio>
            <el-radio :label="Role.LEADER">负责人</el-radio>
            <el-radio :label="Role.ADMIN">管理员</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="submit-btn" :loading="loading" @click="handleLogin">
            立即登录
          </el-button>
        </el-form-item>
        <div class="auth-footer">
          <span class="footer-text">还没有账号？</span>
          <el-link type="primary" :underline="false" @click="toggleMode">
            去注册
          </el-link>
        </div>
      </el-form>

      <!-- 注册表单 -->
      <el-form v-else :model="registerForm" class="auth-form" @keyup.enter="handleRegister">
        <el-form-item>
          <el-input v-model="registerForm.username" placeholder="用户名" :prefix-icon="User" />
        </el-form-item>
        <div class="form-row">
          <el-form-item class="half-item">
            <el-input v-model="registerForm.realName" placeholder="真实姓名" :prefix-icon="Postcard" />
          </el-form-item>
          <el-form-item class="half-item">
            <el-input v-model="registerForm.StudentId" placeholder="学号" :prefix-icon="Avatar" maxlength="8" />
          </el-form-item>
        </div>
        <el-form-item label="性别" class="gender-item">
          <el-radio-group v-model="registerForm.sex" class="gender-radio-group">
            <el-radio :label="Sex.MALE">
              <el-icon><Male /></el-icon> 男
            </el-radio>
            <el-radio :label="Sex.FEMALE">
              <el-icon><Female /></el-icon> 女
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-input v-model="registerForm.email" placeholder="邮箱" :prefix-icon="Message" />
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="registerForm.password"
            type="password"
            placeholder="密码"
            :prefix-icon="Lock"
            show-password
          />
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="registerForm.confirmPassword"
            type="password"
            placeholder="确认密码"
            :prefix-icon="Lock"
            show-password
          />
        </el-form-item>
        <el-form-item class="code-item">
          <div class="code-input-wrapper">
            <el-input v-model="registerForm.code" placeholder="验证码" :prefix-icon="CircleCheck" />
            <el-button
              class="send-code-link"
              :disabled="countdown > 0 || codeLoading"
              link
              type="primary"
              @click="handleSendCode(registerForm.email, 'register')"
            >
              {{ countdown > 0 ? `${countdown}s` : '获取验证码' }}
            </el-button>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="submit-btn" :loading="loading" @click="handleRegister">
            立即注册
          </el-button>
        </el-form-item>
        <div class="auth-footer">
          <span class="footer-text">已有账号？</span>
          <el-link type="primary" :underline="false" @click="toggleMode">
            去登录
          </el-link>
        </div>
      </el-form>
    
    </div>
  </div>
</template>

<style scoped>
.auth-container {
  height: 100vh;
  display: flex;
  justify-content: flex-end;
  /* 表单右对齐 */
  align-items: flex-start;
  /* 改为顶部对齐 */
  padding-top: 6vh;
  /* 固定距离顶部的距离 */
  padding-right: 12%;
  /* 距离右侧间距 */
  background-image: url('/logoBackground.png');
  background-size: cover;
  background-position: top left;
  /* 调整背景位置 */
  background-repeat: no-repeat;
  position: relative;
  overflow: hidden;
  box-sizing: border-box;
}

.auth-form :deep(.el-input__wrapper) {
  background-color: #f9fbf9;
  border-radius: 12px;
  box-shadow: none !important;
  border: 1px solid #e0e0e0;
  height: 36px;
  transition: all 0.3s;
}

.auth-form :deep(.el-input__wrapper.is-focus) {
  border-color: #4caf50;
  background-color: #fff;
}

.auth-form :deep(.el-button--primary:not(.send-code-link)) {
  height: 38px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  margin-top: 5px;
}

.code-input-wrapper {
  display: flex;
  align-items: center;
  width: 100%;
  position: relative;
}

.code-input-wrapper :deep(.el-input__wrapper) {
  padding-right: 100px;
  /* 为按钮留出空间 */
}

.send-code-link {
  position: absolute;
  right: 12px;
  height: 100%;
  z-index: 2;
  font-weight: 500;
  color: #4caf50;
  transition: all 0.3s;
}

.send-code-link:hover:not(:disabled) {
  color: #43a047;
  opacity: 0.8;
}

.send-code-link:disabled {
  color: #a5d6a7;
  cursor: not-allowed;
}

.auth-card {
  width: 420px;
  padding: 30px;
  background: rgba(255, 255, 255, 0.85);
  /* 增加一点透明度 */
  backdrop-filter: blur(15px);
  /* 增强毛玻璃效果 */
  border-radius: 24px;
  /* 更圆润的角 */
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
  z-index: 1;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

/* .auth-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.12);
} */

.auth-header {
  text-align: center;
  margin-bottom: 15px;
}

.form-row {
  display: flex;
  gap: 12px;
}

.half-item {
  flex: 1;
}

.auth-form :deep(.el-form-item) {
  margin-bottom: 16px;
}

.logo-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 15px;
}

.logo-text {
  font-size: 32px;
  font-weight: bold;
  color: #4caf50;
  letter-spacing: 4px;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.05);
}

.auth-title {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}

.auth-subtitle {
  font-size: 13px;
  color: #999;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.auth-form {
  margin-top: 10px;
}

:deep(.el-input__wrapper) {
  padding: 5px 12px;
  border-radius: 10px;
  background-color: #f9f9f9;
  box-shadow: none !important;
  border: 1px solid transparent;
  transition: all 0.3s;
}

:deep(.el-input__wrapper:hover),
:deep(.el-input__wrapper.is-focus) {
  background-color: #fff;
  border-color: #4caf50;
}

.submit-btn {
  width: 100%;
  height: 38px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 10px;
  margin-top: 5px;
  letter-spacing: 2px;
}

.auth-footer {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  margin-top: 15px;
  font-size: 14px;
}

.footer-text {

  color: #666;
  margin-right: 5px;
}

:deep(.el-form-item__label) {
  font-weight: 500;
  color: #555;
}

:deep(.el-radio) {
  margin-right: 20px;
}

:deep(.el-radio__input.is-checked .el-radio__inner) {
  border-color: #4caf50;
  background: #4caf50;
}

:deep(.el-radio__input.is-checked + .el-radio__label) {
  color: #4caf50;
}
</style>
