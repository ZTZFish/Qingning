<template>
  <div class="create-club">
    <el-card class="form-card">
      <template #header>
        <div class="header">
          <span class="title">申请创建社团</span>
        </div>
      </template>
      
      <el-form :model="clubForm" :rules="rules" ref="formRef" label-width="100px" class="club-form">
        <el-form-item label="社团名称" prop="name">
          <el-input v-model="clubForm.name" placeholder="请输入社团名称" />
        </el-form-item>
        
        <el-form-item label="社团类型" prop="type">
          <el-select v-model="clubForm.type" placeholder="请选择社团类型" style="width: 100%">
            <el-option label="学术类" :value="ClubType.ACADEMIC" />
            <el-option label="体育类" :value="ClubType.SPORTS" />
            <el-option label="文艺类" :value="ClubType.ARTS" />
            <el-option label="志愿公益类" :value="ClubType.VOLUNTEER" />
            <el-option label="科技类" :value="ClubType.TECH" />
            <el-option label="娱乐类" :value="ClubType.ENTERTAINMENT" />
            <el-option label="其他" :value="ClubType.OTHER" />
          </el-select>
        </el-form-item>
        
        <el-form-item label="社团封面" prop="coverImage">
          <el-upload
            class="cover-uploader"
            action="#"
            :show-file-list="false"
            :auto-upload="false"
          >
            <img v-if="clubForm.coverImage" :src="clubForm.coverImage" class="cover" />
            <el-icon v-else class="cover-uploader-icon"><Plus /></el-icon>
          </el-upload>
          <div class="upload-tip">建议尺寸 16:9，支持 jpg, png 格式</div>
        </el-form-item>
        
        <el-form-item label="社团简介" prop="description">
          <el-input
            v-model="clubForm.description"
            type="textarea"
            :rows="4"
            placeholder="请详细描述社团的宗旨、活动内容及发展规划..."
          />
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" :loading="loading" @click="handleSubmit">提交申请</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
      
      <div class="audit-notice">
        <el-alert
          title="申请须知"
          type="info"
          description="社团申请提交后将进入人工审核阶段，预计在 1-3 个工作日内完成审批。审批通过后，您将自动成为该社团的负责人。"
          show-icon
          :closable="false"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { ClubType } from '@/types'
import type { FormInstance, FormRules } from 'element-plus'

const formRef = ref<FormInstance>()
const loading = ref(false)

const clubForm = reactive({
  name: '',
  type: ClubType.OTHER,
  description: '',
  coverImage: ''
})

const rules = reactive<FormRules>({
  name: [
    { required: true, message: '请输入社团名称', trigger: 'blur' },
    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  type: [
    { required: true, message: '请选择社团类型', trigger: 'change' }
  ],
  description: [
    { required: true, message: '请输入社团简介', trigger: 'blur' },
    { min: 10, message: '简介不能少于 10 个字符', trigger: 'blur' }
  ]
})

const handleSubmit = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate((valid) => {
    if (valid) {
      loading.value = true
      // 模拟提交
      setTimeout(() => {
        loading.value = false
        ElMessage.success('申请提交成功，请等待管理员审批')
        handleReset()
      }, 1000)
    }
  })
}

const handleReset = () => {
  if (!formRef.value) return
  formRef.value.resetFields()
}
</script>

<style scoped>
.create-club {
  max-width: 800px;
  margin: 0 auto;
}

.form-card {
  border-radius: 12px;
}

.header {
  font-weight: bold;
  font-size: 18px;
}

.cover-uploader {
  border: 1px dashed var(--el-border-color);
  border-radius: 8px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: 320px;
  height: 180px;
  transition: var(--el-transition-duration-fast);
}

.cover-uploader:hover {
  border-color: var(--el-color-primary);
}

.cover-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 320px;
  height: 180px;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
}

.cover {
  width: 320px;
  height: 180px;
  display: block;
  object-fit: cover;
}

.upload-tip {
  font-size: 12px;
  color: #909399;
  margin-top: 8px;
}

.audit-notice {
  margin-top: 32px;
}
</style>
