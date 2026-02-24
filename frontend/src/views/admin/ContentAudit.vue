<template>
  <div class="content-audit">
    <el-tabs v-model="activeTab" class="audit-tabs">
      <!-- 社团创建审批 -->
      <el-tab-pane label="社团申请审批" name="clubs">
        <CommonList
          title="待审批社团"
          :data="pendingClubs"
          :columns="clubColumns"
          :total="pendingClubs.length"
          action-width="200"
        >
          <template #actions="{ row }">
            <el-button type="success" link @click="handleApproveClub(row)">通过</el-button>
            <el-button type="danger" link @click="handleRejectClub(row)">拒绝</el-button>
            <el-button type="info" link @click="handleViewClub(row)">详情</el-button>
          </template>
        </CommonList>
      </el-tab-pane>

      <!-- 活动发布审批 -->
      <el-tab-pane label="活动申请审批" name="activities">
        <CommonList
          title="待审批活动"
          :data="pendingActivities"
          :columns="activityColumns"
          :total="pendingActivities.length"
          action-width="200"
        >
          <template #actions="{ row }">
            <el-button type="success" link @click="handleApproveActivity(row)">通过</el-button>
            <el-button type="danger" link @click="handleRejectActivity(row)">拒绝</el-button>
            <el-button type="info" link @click="handleViewActivity(row)">详情</el-button>
          </template>
        </CommonList>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import CommonList from '@/components/CommonList.vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Status, ActivityStatus, ClubType, type Column } from '@/types'

const activeTab = ref('clubs')

const clubColumns: Column[] = [
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
  { label: '申请人', prop: 'leader.realName', width: '100' },
  { label: '申请时间', prop: 'createdAt', width: '120' }
]

const activityColumns: Column[] = [
  { label: '封面', prop: 'coverImage', type: 'image', width: '120' },
  { label: '活动名称', prop: 'name', minWidth: '150' },
  { label: '所属社团', prop: 'club.name', minWidth: '120' },
  { label: '开始时间', prop: 'date', width: '160' },
  { label: '发布人', prop: 'leaderName', width: '100' }
]

// 模拟待审批社团数据
const pendingClubs = ref<any[]>([
  { id: 101, name: '青柠文学社', type: ClubType.ACADEMIC, leader: { realName: '王小明' }, status: Status.PENDING, createdAt: '2024-02-20', coverImage: '' },
  { id: 102, name: '青柠街舞社', type: ClubType.ARTS, leader: { realName: '李华' }, status: Status.PENDING, createdAt: '2024-02-22', coverImage: '' }
])

// 模拟待审批活动数据
const pendingActivities = ref<any[]>([
  { id: 201, name: '春季文学沙龙', club: { name: '青柠文学社' }, leaderName: '王小明', date: '2024-03-15 14:00', status: ActivityStatus.PENDING, coverImage: '' },
  { id: 202, name: '校园街舞大赛', club: { name: '青柠街舞社' }, leaderName: '李华', date: '2024-03-20 19:00', status: ActivityStatus.PENDING, coverImage: '' }
])

const handleApproveClub = (row: any) => {
  ElMessageBox.confirm(`确定要通过社团 ${row.name} 的创建申请吗？`, '审批提示', { type: 'success' }).then(() => {
    pendingClubs.value = pendingClubs.value.filter(c => c.id !== row.id)
    ElMessage.success('审批通过')
  }).catch(() => {})
}

const handleRejectClub = (row: any) => {
  ElMessageBox.prompt(`请输入拒绝社团 ${row.name} 的原因`, '审批提示', { type: 'warning' }).then((data: any) => {
    pendingClubs.value = pendingClubs.value.filter(c => c.id !== row.id)
    ElMessage.warning(`已拒绝申请，原因: ${data.value}`)
  }).catch(() => {})
}

const handleApproveActivity = (row: any) => {
  ElMessageBox.confirm(`确定要通过活动 ${row.name} 的发布申请吗？`, '审批提示', { type: 'success' }).then(() => {
    pendingActivities.value = pendingActivities.value.filter(a => a.id !== row.id)
    ElMessage.success('审批通过')
  }).catch(() => {})
}

const handleRejectActivity = (row: any) => {
  ElMessageBox.prompt(`请输入拒绝活动 ${row.name} 的原因`, '审批提示', { type: 'warning' }).then((data: any) => {
    pendingActivities.value = pendingActivities.value.filter(a => a.id !== row.id)
    ElMessage.warning(`已拒绝申请，原因: ${data.value}`)
  }).catch(() => {})
}

const handleViewClub = (row: any) => ElMessage.info('查看详情')
const handleViewActivity = (row: any) => ElMessage.info('查看详情')
</script>

<style scoped>
.content-audit {
  background-color: #fff;
  padding: 24px;
  border-radius: 12px;
}

.audit-tabs :deep(.el-tabs__nav-wrap::after) {
  height: 1px;
}
</style>
