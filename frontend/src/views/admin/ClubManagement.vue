<template>
  <div class="club-management">
    <CommonList
      title="社团管理"
      :data="clubs"
      :columns="columns"
      :total="clubs.length"
      action-width="250"
    >
      <template #header-actions>
        <el-button type="primary" @click="handleAddClub">创建社团</el-button>
        <el-input
          v-model="searchQuery"
          placeholder="搜索社团名称/类型/负责人"
          prefix-icon="Search"
          style="width: 240px; margin-left: 12px"
          clearable
        />
      </template>

      <template #actions="{ row }">
        <template v-if="row.status === 'PENDING'">
          <el-button type="success" link @click="handleApprove(row)">通过</el-button>
          <el-button type="danger" link @click="handleReject(row)">拒绝</el-button>
        </template>
        <el-button type="primary" link @click="handleEdit(row)">编辑</el-button>
        <el-button type="danger" link @click="handleDelete(row)">解散</el-button>
      </template>
    </CommonList>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import CommonList from '@/components/CommonList.vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search } from '@element-plus/icons-vue'
import { Status, ClubType, type Column } from '@/types'

const searchQuery = ref('')

const columns: Column[] = [
  { label: '封面', prop: 'coverImage', type: 'image', width: '120' },
  { label: '社团名称', prop: 'name', minWidth: '120' },
  {
    label: '类型',
    prop: 'type',
    type: 'tag',
    width: '120',
    tagMap: {
      [ClubType.ACADEMIC]: { label: '学术类', type: 'primary' },
      [ClubType.SPORTS]: { label: '体育类', type: 'success' },
      [ClubType.ARTS]: { label: '文艺类', type: 'warning' },
      [ClubType.TECH]: { label: '科技类', type: 'info' }
    }
  },
  { label: '负责人', prop: 'leader.realName', width: '100' },
  {
    label: '状态',
    prop: 'status',
    type: 'tag',
    width: '120',
    tagMap: {
      [Status.PENDING]: { label: '待审批', type: 'warning' },
      [Status.APPROVED]: { label: '正常', type: 'success' },
      [Status.REJECTED]: { label: '已驳回', type: 'danger' }
    }
  },
  { label: '创建时间', prop: 'createdAt', width: '120' }
]

// 模拟数据
const clubs = ref<any[]>([
  { id: 1, name: '青柠编程社', type: ClubType.TECH, leader: { realName: '张三' }, status: Status.APPROVED, createdAt: '2023-09-01', coverImage: '' },
  { id: 2, name: '青柠羽毛球社', type: ClubType.SPORTS, leader: { realName: '李四' }, status: Status.APPROVED, createdAt: '2023-09-10', coverImage: '' },
  { id: 3, name: '青柠摄影社', type: ClubType.ARTS, leader: { realName: '王五' }, status: Status.PENDING, createdAt: '2023-10-01', coverImage: '' },
  { id: 4, name: '青柠学术社', type: ClubType.ACADEMIC, leader: { realName: '赵六' }, status: Status.REJECTED, createdAt: '2023-09-15', coverImage: '' }
])

const handleApprove = (row: any) => {
  ElMessageBox.confirm(`确定要通过社团 ${row.name} 的创建申请吗？`, '审批提示', {
    type: 'success'
  }).then(() => {
    row.status = Status.APPROVED
    ElMessage.success('审批已通过')
  })
}

const handleReject = (row: any) => {
  ElMessageBox.prompt(`请输入拒绝社团 ${row.name} 的原因`, '审批提示', {
    inputPlaceholder: '拒绝原因',
    type: 'warning'
  }).then((data: any) => {
    const value = data.value
    row.status = Status.REJECTED
    ElMessage.warning(`申请已驳回，原因: ${value}`)
  }).catch(() => {
    // 用户取消操作，不做处理
  })
}

const handleAddClub = () => {
  ElMessage.info('前往创建社团页面')
}

const handleEdit = (row: any) => {
  ElMessage.info(`编辑社团: ${row.name}`)
}

const handleDelete = (row: any) => {
  ElMessageBox.confirm(`确定要解散社团 ${row.name} 吗？解散后不可恢复！`, '警告', {
    type: 'error'
  }).then(() => {
    clubs.value = clubs.value.filter(c => c.id !== row.id)
    ElMessage.success('社团已解散')
  })
}
</script>
