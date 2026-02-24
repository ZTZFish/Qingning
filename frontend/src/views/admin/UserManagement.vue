<template>
  <div class="user-management">
    <CommonList
      title="用户管理"
      :data="users"
      :columns="columns"
      :total="users.length"
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
          v-if="row.role === 'USER'"
          type="primary" 
          link 
          @click="handleSetLeader(row)"
        >
          设为负责人
        </el-button>
        <el-button 
          v-if="row.role === 'LEADER'"
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
import { ref } from 'vue'
import CommonList from '@/components/CommonList.vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search } from '@element-plus/icons-vue'
import { Role, type Column } from '@/types'

const searchQuery = ref('')

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

// 模拟数据
const users = ref<any[]>([
  { id: 1, username: 'admin', realName: '管理员', StudentId: '20230001', role: Role.ADMIN, isDeleted: false, avatar: '' },
  { id: 2, username: 'zhangsan', realName: '张三', StudentId: '20231001', role: Role.LEADER, isDeleted: false, avatar: '' },
  { id: 3, username: 'lisi', realName: '李四', StudentId: '20231002', role: Role.USER, isDeleted: false, avatar: '' },
  { id: 4, username: 'wangwu', realName: '王五', StudentId: '20231003', role: Role.USER, isDeleted: true, avatar: '' },
  { id: 5, username: 'zhaoliu', realName: '赵六', StudentId: '20231004', role: Role.USER, isDeleted: false, avatar: '' }
])

const handleSetLeader = (row: any) => {
  ElMessageBox.confirm(`确定要将用户 ${row.realName} 设为社团负责人吗？`, '提示', {
    type: 'info'
  }).then(() => {
    row.role = Role.LEADER
    ElMessage.success('设置成功')
  })
}

const handleCancelLeader = (row: any) => {
  ElMessageBox.confirm(`确定要取消用户 ${row.realName} 的负责人权限吗？`, '提示', {
    type: 'warning'
  }).then(() => {
    row.role = Role.USER
    ElMessage.success('已取消权限')
  })
}

const handleToggleStatus = (row: any) => {
  const action = row.isDeleted ? '恢复' : '封禁'
  ElMessageBox.confirm(`确定要${action}用户 ${row.realName} 吗？`, '警告', {
    type: 'warning'
  }).then(() => {
    row.isDeleted = !row.isDeleted
    ElMessage.success(`${action}成功`)
  })
}

const handleViewDetail = (row: any) => {
  ElMessage.info(`查看用户 ${row.username} 的详细信息`)
}
</script>
