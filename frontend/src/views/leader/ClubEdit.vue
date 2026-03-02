<template>
  <div class="club-edit-container" v-loading="loading">
    <div class="page-header">
      <h2 class="page-title">编辑社团信息</h2>
      <el-button @click="router.back()">返回</el-button>
    </div>

    <el-card shadow="never" class="edit-card">
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="100px"
        label-position="top"
      >
        <el-form-item label="社团名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入社团名称" />
        </el-form-item>

        <el-form-item label="社团简介" prop="description">
          <el-input
            v-model="form.description"
            type="textarea"
            :rows="6"
            placeholder="请输入社团简介"
          />
        </el-form-item>

        <el-form-item label="社团封面" prop="coverImage">
          <el-upload
            class="avatar-uploader"
            :action="uploadUrl"
            :show-file-list="false"
            :headers="headers"
            :on-success="handleCoverSuccess"
            :before-upload="beforeCoverUpload"
          >
            <img v-if="coverUrl" :src="coverUrl" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
          <div class="upload-tip">支持 jpg/png 格式，大小不超过 5MB</div>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleSubmit" :loading="submitting">
            保存修改
          </el-button>
          <el-button @click="router.back()">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ElMessage, type FormInstance, type UploadProps } from "element-plus";
import { Plus } from "@element-plus/icons-vue";
import { getClubDetail, updateClubInfo } from "@/api/club";

const route = useRoute();
const router = useRouter();
const clubId = parseInt(route.params.id as string, 10);

const loading = ref(false);
const submitting = ref(false);
const formRef = ref<FormInstance>();

const form = ref({
  name: "",
  description: "",
  coverImage: "",
});

const rules = {
  name: [
    { required: true, message: "请输入社团名称", trigger: "blur" },
    { min: 2, max: 50, message: "长度在 2 到 50 个字符", trigger: "blur" },
  ],
  description: [
    { required: true, message: "请输入社团简介", trigger: "blur" },
    { min: 10, max: 500, message: "长度在 10 到 500 个字符", trigger: "blur" },
  ],
};

const BASE_URL = import.meta.env.VITE_API_BASE_URL.replace(/\/api\/?$/, "");
const uploadUrl = `${import.meta.env.VITE_API_BASE_URL}/clubs/cover`;
const token = localStorage.getItem("token");
const headers = { Authorization: `Bearer ${token}` };

const coverUrl = computed(() => {
  if (!form.value.coverImage) return "";
  if (form.value.coverImage.startsWith("http")) return form.value.coverImage;
  return `${BASE_URL}${form.value.coverImage}`;
});

const fetchClubInfo = async () => {
  loading.value = true;
  try {
    const res = await getClubDetail(clubId);
    form.value = {
      name: res.name,
      description: res.description,
      coverImage: res.coverImage || "",
    };
  } catch (error: any) {
    ElMessage.error(error.message || "获取社团信息失败");
    router.back();
  } finally {
    loading.value = false;
  }
};

const handleCoverSuccess: UploadProps["onSuccess"] = (response) => {
  if (response.code === 200) {
    form.value.coverImage = response.data.url;
    ElMessage.success("封面上传成功");
  } else {
    ElMessage.error(response.message || "上传失败");
  }
};

const beforeCoverUpload: UploadProps["beforeUpload"] = (file) => {
  const isImg = file.type === "image/jpeg" || file.type === "image/png";
  const isLt5M = file.size / 1024 / 1024 < 5;

  if (!isImg) {
    ElMessage.error("封面图片只能是 JPG/PNG 格式!");
  }
  if (!isLt5M) {
    ElMessage.error("封面图片大小不能超过 5MB!");
  }
  return isImg && isLt5M;
};

const handleSubmit = async () => {
  if (!formRef.value) return;
  await formRef.value.validate(async (valid) => {
    if (valid) {
      submitting.value = true;
      try {
        await updateClubInfo(clubId, form.value);
        ElMessage.success("社团信息更新成功");
        router.push(`/clubs/${clubId}`);
      } catch (error: any) {
        ElMessage.error(error.message || "更新失败");
      } finally {
        submitting.value = false;
      }
    }
  });
};

onMounted(() => {
  fetchClubInfo();
});
</script>

<style scoped>
.club-edit-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.page-title {
  font-size: 24px;
  font-weight: 600;
  color: #303133;
  margin: 0;
}

.edit-card {
  padding: 20px;
}

.avatar-uploader .avatar {
  width: 300px;
  height: 180px;
  display: block;
  object-fit: cover;
  border-radius: 6px;
}

.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 300px;
  height: 180px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f7fa;
}

.upload-tip {
  margin-top: 8px;
  font-size: 12px;
  color: #909399;
}
</style>