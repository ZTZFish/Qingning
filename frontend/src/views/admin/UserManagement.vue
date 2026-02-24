<template>
  <div class="user-management">
    <CommonList
      title="用户管理"
      :data="filteredUsers"
      :columns="columns"
      :total="filteredUsers.length"
      :loading="loading"
      action-width="250"
    >
      <template #header-actions>
        <el-input
          v-model="searchQuery"
          placeholder="搜索用户名/真实姓名/学号"
          prefix-icon="Search"
          style="width: 240px"
          clearable
        />
      </template>

      <template #actions="{ row }">
        <el-button 
          v-if="row.role === Role.USER"
          type="primary" 
          link 
          @click="handleSetLeader(row)"
        >
          设为负责人
        </el-button>
        <el-button 
          v-if="row.role === Role.LEADER"
          type="warning" 
          link 
          @click="handleCancelLeader(row)"
        >
          取消负责人权限
        </el-button>
        <el-button 
          :type="row.isDeleted ? 'success' : 'danger'" 
          link 
          @click="handleToggleStatus(row)"
        >
          {{ row.isDeleted ? '解封' : '封禁' }}
        </el-button>
        <el-button type="info" link @click="handleViewDetail(row)">详情</el-button>
      </template>
    </CommonList>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import CommonList from '@/components/CommonList.vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search } from '@element-plus/icons-vue'
import { Role, type Column, type User } from '@/types'
import { getAllUsers, adminUpdateUser } from '@/api/user'

const searchQuery = ref('')
const users = ref<User[]>([])
const loading = ref(false)

const filteredUsers = computed(() => {
  if (!searchQuery.value) return users.value
  const query = searchQuery.value.toLowerCase()
  return users.value.filter(user =>
    user.username.toLowerCase().includes(query) ||
    (user.realName && user.realName.toLowerCase().includes(query)) ||
    (user.StudentId && String(user.StudentId).includes(query))
  )
})

const columns: Column[] = [
  { label: '头像', prop: 'avatar', type: 'avatar', width: '80' },
  { label: '用户名', prop: 'username', minWidth: '120' },
  { label: '真实姓名', prop: 'realName', minWidth: '100' },
  { label: '学号', prop: 'StudentId', width: '120' },
  {
    label: '角色',
    prop: 'role',
    type: 'tag',
    width: '120',
    tagMap: {
      [Role.ADMIN]: { label: '管理员', type: 'danger' },
      [Role.LEADER]: { label: '负责人', type: 'warning' },
      [Role.USER]: { label: '普通用户', type: 'info' }
    }
  },
  {
    label: '状态',
    prop: 'isDeleted',
    type: 'tag',
    width: '100',
    tagMap: {
      false: { label: '正常', type: 'success' },
      true: { label: '已封禁', type: 'danger' }
    }
  }
]

const fetchUsers = async () => {
  loading.value = true
  try {
    const data = await getAllUsers()
    users.value = data
  } catch (error: any) {
    ElMessage.error(error.message || '获取用户列表失败')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchUsers()
})

const handleSetLeader = (row: User) => {
  ElMessageBox.confirm(`确定要将用户 ${row.realName} 设为社团负责人吗？`, '提示', {
    type: 'info'
  }).then(async () => {
    try {
      await adminUpdateUser(row.id, { role: Role.LEADER })
      ElMessage.success('设置成功')
      fetchUsers()
    } catch (error: any) {
      ElMessage.error(error.message || '操作失败')
    }
  })
}

const handleCancelLeader = (row: User) => {
  ElMessageBox.confirm(`确定要取消用户 ${row.realName} 的负责人权限吗？`, '提示', {
    type: 'warning'
  }).then(async () => {
    try {
      await adminUpdateUser(row.id, { role: Role.USER })
      ElMessage.success('已取消权限')
      fetchUsers()
    } catch (error: any) {
      ElMessage.error(error.message || '操作失败')
    }
  })
}

const handleToggleStatus = (row: User) => {
  const action = row.isDeleted ? '解封' : '封禁'
  ElMessageBox.confirm(`确定要${action}用户 ${row.realName} 吗？`, '警告', {
    type: 'warning'
  }).then(async () => {
    try {
      await adminUpdateUser(row.id, { isDeleted: !row.isDeleted })
      ElMessage.success(`${action}成功`)
      fetchUsers()
    } catch (error: any) {
      ElMessage.error(error.message || '操作失败')
    }
  })
}

const handleViewDetail = (row: User) => {
  ElMessage.info(`查看用户 ${row.username} 的详细信息`)
}
</script>
