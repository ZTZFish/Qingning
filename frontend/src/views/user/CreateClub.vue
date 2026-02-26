<template>
  <div class="create-club">
    <el-card class="form-card">
      <template #header>
        <div class="header">
          <div class="header-left">
            <span class="title">申请创建社团</span>
            <el-tooltip content="点击查看社团创建指南" placement="top">
              <el-icon class="help-icon" @click="showGuide = true"><QuestionFilled /></el-icon>
            </el-tooltip>
          </div>
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
            class="uploader"
            action="#"
            :show-file-list="false"
            :http-request="handleCoverUpload"
          >
            <img v-if="clubForm.coverImage" :src="getCoverUrl(clubForm.coverImage)" class="preview-img" />
            <el-icon v-else class="uploader-icon"><Plus /></el-icon>
          </el-upload>
          <div class="upload-tip">建议尺寸 16:9，支持 jpg, png 格式</div>
        </el-form-item>

        <el-form-item label="手续照片" prop="materials">
          <el-upload
            class="uploader"
            action="#"
            :show-file-list="false"
            :http-request="handleMaterialsUpload"
          >
            <img v-if="clubForm.materials" :src="getCoverUrl(clubForm.materials)" class="preview-img" />
            <el-icon v-else class="uploader-icon"><Plus /></el-icon>
          </el-upload>
          <div class="upload-tip highlight-tip">
            <el-icon><InfoFilled /></el-icon>
            需要社团指导老师和第二课堂办事处的盖章
          </div>
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

    <!-- 创建指南弹窗 -->
    <el-dialog v-model="showGuide" title="社团创建指南" width="600px" class="guide-dialog">
      <div class="guide-content">
        <el-steps direction="vertical" :active="4">
          <el-step title="提交社团成立申请材料">
            <template #description>
              <p>准备：社团成立申请书、章程、成员名单、组织架构、指导老师基本信息。</p>
            </template>
          </el-step>
          <el-step title="联系并确定社团指导老师">
            <template #description>
              <ul>
                <li>与指导老师沟通，确认愿意担任本社团指导教师。</li>
                <li>将社团成立申请书、社团章程交由指导老师审核。</li>
                <li>审核通过后：指导老师亲笔签名 + 加盖指导老师所在部门 / 学院公章。</li>
              </ul>
            </template>
          </el-step>
          <el-step title="向第二课堂办事处提交完整材料">
            <template #description>
              <p>提交已完成指导老师签字盖章的全套材料：</p>
              <ul>
                <li>签字盖章后的申请书、章程</li>
                <li>指导老师信息确认表</li>
                <li>社团成员信息表</li>
              </ul>
            </template>
          </el-step>
          <el-step title="第二课堂办事处审核与盖章">
            <template #description>
              <ul>
                <li>第二课堂办事处对材料完整性、合规性进行审核。</li>
                <li>审核通过：在社团成立申请表 / 备案表上加盖第二课堂办事处公章。</li>
              </ul>
            </template>
          </el-step>
          <el-step title="完成社团备案，正式成立">
            <template #description>
              <p>加盖两处有效签章后，社团完成官方备案，在通过审核后可正常开展招新、训练、活动等工作。</p>
            </template>
          </el-step>
        </el-steps>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Plus, QuestionFilled, InfoFilled } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { ClubType } from '@/types'
import { createClub, uploadClubCover, uploadClubMaterials } from '@/api/club'
import type { FormInstance, FormRules } from 'element-plus'

const formRef = ref<FormInstance>()
const loading = ref(false)
const showGuide = ref(false)

const BASE_URL = import.meta.env.VITE_API_BASE_URL.replace(/\/api\/?$/, '')

const getCoverUrl = (path: string) => {
  if (!path) return ''
  if (path.startsWith('http')) return path
  return `${BASE_URL}${path}`
}

const clubForm = reactive({
  name: '',
  type: ClubType.OTHER,
  description: '',
  coverImage: '',
  materials: ''
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
  ],
  materials: [
    { required: true, message: '请上传加盖公章的手续照片', trigger: 'change' }
  ]
})

const handleCoverUpload = async (options: any) => {
  const isLt5M = options.file.size / 1024 / 1024 < 5
  if (!isLt5M) {
    ElMessage.error('图片体积不能超过 5MB')
    return
  }

  const formData = new FormData()
  formData.append('cover', options.file)
  try {
    const res = await uploadClubCover(formData)
    clubForm.coverImage = res.url
    ElMessage.success('封面上传成功')
  } catch (error: any) {
    console.error('Upload error:', error)
    const msg = error.response?.data?.message || error.message || '上传失败'
    ElMessage.error(`封面上传失败: ${msg}`)
  }
}

const handleMaterialsUpload = async (options: any) => {
  const isLt5M = options.file.size / 1024 / 1024 < 5
  if (!isLt5M) {
    ElMessage.error('手续照片体积不能超过 5MB')
    return
  }

  const formData = new FormData()
  formData.append('materials', options.file)
  try {
    const res = await uploadClubMaterials(formData)
    clubForm.materials = res.url
    ElMessage.success('手续照片上传成功')
  } catch (error: any) {
    console.error('Upload error:', error)
    const msg = error.response?.data?.message || error.message || '上传失败'
    ElMessage.error(`手续照片上传失败: ${msg}`)
  }
}

const handleSubmit = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true
      try {
        await createClub(clubForm)
        ElMessage.success('申请提交成功，请等待管理员审批')
        handleReset()
      } catch (error: any) {
        ElMessage.error(error.message || '提交失败')
      } finally {
        loading.value = false
      }
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
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.title {
  font-weight: bold;
  font-size: 18px;
}

.help-icon {
  font-size: 18px;
  color: #909399;
  cursor: pointer;
  transition: color 0.3s;
}

.help-icon:hover {
  color: var(--el-color-primary);
}

.uploader {
  border: 1px dashed var(--el-border-color);
  border-radius: 8px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: 320px;
  height: 180px;
  transition: var(--el-transition-duration-fast);
}

.uploader:hover {
  border-color: var(--el-color-primary);
}

.uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 320px;
  height: 180px;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
}

.preview-img {
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

.highlight-tip {
  color: var(--el-color-warning);
  display: flex;
  align-items: center;
  gap: 4px;
  font-weight: 500;
}

.audit-notice {
  margin-top: 32px;
}

.guide-content {
  padding: 10px 20px;
}

.guide-content p {
  margin: 0;
  line-height: 1.6;
}

.guide-content ul {
  margin: 8px 0;
  padding-left: 20px;
}

.guide-content li {
  list-style: disc;
  margin-bottom: 4px;
  color: #606266;
}
</style>
