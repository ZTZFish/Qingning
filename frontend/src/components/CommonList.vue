<template>
  <div class="common-list">
    <el-card shadow="never" class="list-card">
      <template #header>
        <div class="list-header">
          <div class="left">
            <h3 class="title">{{ title }}</h3>
            <span class="count" v-if="total !== undefined">共 {{ total }} 条</span>
          </div>
          <div class="right">
            <slot name="header-actions"></slot>
          </div>
        </div>
      </template>

      <el-table :data="data" style="width: 100%" v-loading="loading">
        <el-table-column
          v-for="col in columns"
          :key="col.prop"
          :prop="col.prop"
          :label="col.label"
          :width="col.width"
          :min-width="col.minWidth"
        >
          <template #default="scope">
            <!-- 自定义渲染：头像 -->
            <template v-if="col.type === 'avatar'">
              <el-avatar :size="40" :src="getAvatarUrl(getNestedValue(scope.row, col.prop))" />
            </template>
            
            <!-- 自定义渲染：标签/状态 -->
            <template v-else-if="col.type === 'tag'">
              <el-tag :type="getTagType(getNestedValue(scope.row, col.prop), col.tagMap)">
                {{ getTagLabel(getNestedValue(scope.row, col.prop), col.tagMap) }}
              </el-tag>
            </template>

            <!-- 自定义渲染：图片 -->
            <template v-else-if="col.type === 'image'">
              <el-image 
                style="width: 80px; height: 45px; border-radius: 4px" 
                :src="getImageUrl(getNestedValue(scope.row, col.prop))" 
                fit="cover"
              />
            </template>

            <!-- 默认渲染文本 -->
            <template v-else>
              {{ getNestedValue(scope.row, col.prop) }}
            </template>
          </template>
        </el-table-column>

        <!-- 操作列 -->
        <el-table-column label="操作" :width="actionWidth" fixed="right">
          <template #default="scope">
            <div class="actions">
              <slot name="actions" :row="scope.row"></slot>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-wrapper" v-if="total !== undefined && total > 0">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :total="total"
          layout="total, prev, pager, next"
          @current-change="handlePageChange"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { Column } from '@/types'

const props = defineProps<{
  title: string;
  data: any[];
  columns: Column[];
  loading?: boolean;
  total?: number;
  actionWidth?: string | number;
}>()

const emit = defineEmits(['page-change'])

const currentPage = ref(1)
const pageSize = ref(10)

const BASE_URL = import.meta.env.VITE_API_BASE_URL.replace(/\/api\/?$/, '')

const getAvatarUrl = (path?: string) => {
  if (!path) return 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'
  if (path.startsWith('http')) return path
  return `${BASE_URL}${path}`
}

const getImageUrl = (path?: string) => {
  if (!path) return ''
  if (path.startsWith('http')) return path
  return `${BASE_URL}${path}`
}

const getNestedValue = (obj: any, path: string) => {
  if (!path) return ''
  return path.split('.').reduce((acc, part) => acc && acc[part], obj)
}

const getTagType = (val: any, tagMap?: any) => {
  if (tagMap && tagMap[val]) return tagMap[val].type
  return 'info'
}

const getTagLabel = (val: any, tagMap?: any) => {
  if (tagMap && tagMap[val]) return tagMap[val].label
  return val
}

const handlePageChange = (page: number) => {
  emit('page-change', page)
}
</script>

<style scoped>
.common-list {
  margin-bottom: 20px;
}

.list-card {
  border-radius: 12px;
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.left {
  display: flex;
  align-items: baseline;
  gap: 12px;
}

.title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}

.count {
  font-size: 13px;
  color: #909399;
}

.actions {
  display: flex;
  gap: 8px;
}

.pagination-wrapper {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

:deep(.el-table__header) {
  background-color: #f5f7fa;
}

:deep(.el-table) {
  --el-table-header-bg-color: #f5f7fa;
}
</style>
