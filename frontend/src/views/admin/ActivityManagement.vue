<template>
  <div class="activity-management">
    <CommonList
      title="活动管理"
      :data="activities"
      :columns="columns"
      :total="activities.length"
      action-width="300"
    >
      <template #header-actions>
        <el-button v-if="userStore.user?.role === 'LEADER'" type="primary" @click="handlePublish">发布活动</el-button>
        <el-input
          v-model="searchQuery"
          placeholder="搜索活动标题/所属社团"
          prefix-icon="Search"
          style="width: 240px; margin-left: 12px"
          clearable
        />
      </template>

      <template #actions="{ row }">
        <!-- 负责人特有操作 -->
        <template v-if="userStore.user?.role === 'LEADER'">
          <el-button type="primary" link @click="handleEdit(row)">编辑</el-button>
          <el-button type="success" link @click="handleRecruit(row)">录取管理</el-button>
          <el-button type="danger" link @click="handleDelete(row)">取消活动</el-button>
        </template>
        
        <!-- 管理员特有操作 -->
        <template v-else-if="userStore.user?.role === 'ADMIN'">
          <el-button type="warning" link @click="handleAudit(row)">下架/整改</el-button>
          <el-button type="danger" link @click="handleDelete(row)">强行删除</el-button>
        </template>
        
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
import { useUserStore } from '@/stores/user'
import { ActivityStatus, Role, type Column } from '@/types'

const userStore = useUserStore()
const searchQuery = ref('')

const columns: Column[] = [
  { label: '封面', prop: 'coverImage', type: 'image', width: '120' },
  { label: '活动名称', prop: 'name', minWidth: '150' },
  { label: '所属社团', prop: 'club.name', minWidth: '120' },
  { label: '开始时间', prop: 'date', width: '160' },
  { label: '结束时间', prop: 'endAt', width: '160' },
  {
    label: '状态',
    prop: 'status',
    type: 'tag',
    width: '120',
    tagMap: {
      [ActivityStatus.APPROVED]: { label: '已发布', type: 'success' },
      [ActivityStatus.ONGOING]: { label: '进行中', type: 'primary' },
      [ActivityStatus.FINISHED]: { label: '已结束', type: 'info' },
      [ActivityStatus.PENDING]: { label: '待审核', type: 'warning' },
      [ActivityStatus.REJECTED]: { label: '已拒绝', type: 'danger' },
      [ActivityStatus.DRAFT]: { label: '草稿', type: 'info' },
      [ActivityStatus.CANCELED]: { label: '已取消', type: 'danger' }
    }
  }
]

// 模拟数据
const activities = ref<any[]>([
  { id: 1, name: '青柠编程大赛', club: { name: '青柠编程社' }, date: '2023-11-15 14:00', endAt: '2023-11-15 18:00', status: ActivityStatus.APPROVED, coverImage: '' },
  { id: 2, name: '青柠杯羽毛球赛', club: { name: '青柠羽毛球社' }, date: '2023-11-20 09:00', endAt: '2023-11-20 17:00', status: ActivityStatus.ONGOING, coverImage: '' },
  { id: 3, name: '青柠摄影作品展', club: { name: '青柠摄影社' }, date: '2023-11-25 10:00', endAt: '2023-11-25 18:00', status: ActivityStatus.PENDING, coverImage: '' },
  { id: 4, name: '青柠学术研讨会', club: { name: '青柠学术社' }, date: '2023-11-01 14:00', endAt: '2023-11-01 16:00', status: ActivityStatus.FINISHED, coverImage: '' }
])

const handlePublish = () => {
  ElMessage.info('前往发布活动页面')
}

const handleEdit = (row: any) => {
  ElMessage.info(`编辑活动: ${row.name}`)
}

const handleRecruit = (row: any) => {
  ElMessage.success(`打开活动 ${row.name} 的人员录取管理页面`)
}

const handleAudit = (row: any) => {
  ElMessageBox.prompt(`请输入下架活动 ${row.name} 的原因`, '违规处理', {
    inputPlaceholder: '下架原因',
    type: 'warning'
  }).then((data: any) => {
    const value = data.value
    row.status = ActivityStatus.PENDING
    ElMessage.warning(`活动已下架并进入整改状态，原因: ${value}`)
  }).catch(() => {
    // 用户取消操作，不做处理
  })
}

const handleDelete = (row: any) => {
  ElMessageBox.confirm(`确定要取消活动 ${row.name} 吗？此操作不可逆！`, '警告', {
    type: 'error'
  }).then(() => {
    activities.value = activities.value.filter(a => a.id !== row.id)
    ElMessage.success('活动已取消')
  })
}

const handleViewDetail = (row: any) => {
  ElMessage.info(`查看活动 ${row.name} 的详细信息`)
}
</script>
