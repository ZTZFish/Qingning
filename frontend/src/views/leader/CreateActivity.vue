<template>
  <div class="create-activity-container" v-loading="loading">
    <div class="page-header">
      <h2 class="page-title">发布活动</h2>
      <el-button @click="router.back()">返回</el-button>
    </div>

    <el-card shadow="never" class="edit-card">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px" label-position="top">
        <el-form-item label="所属社团" prop="clubId">
          <el-select v-model="form.clubId" placeholder="请选择社团" style="width: 280px">
            <el-option v-for="club in myClubs" :key="club.id" :label="club.name" :value="club.id" />
          </el-select>
        </el-form-item>

        <el-form-item label="活动名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入活动名称" />
        </el-form-item>

        <el-form-item label="活动简介" prop="description">
          <el-input v-model="form.description" type="textarea" :rows="6" placeholder="请输入活动简介" />
        </el-form-item>

        <el-form-item label="活动封面" prop="coverImage">
          <el-upload
            class="avatar-uploader"
            :action="uploadUrl"
            :name="'cover'"
            accept="image/*"
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

        <el-form-item label="开始时间" prop="date">
          <el-date-picker v-model="form.date" type="datetime" placeholder="选择开始时间" style="width: 280px" />
        </el-form-item>

        <el-form-item label="结束时间" prop="endAt">
          <el-date-picker v-model="form.endAt" type="datetime" placeholder="选择结束时间" style="width: 280px" />
        </el-form-item>

        <el-form-item label="活动地点" prop="location">
          <el-input v-model="form.location" placeholder="线上活动可不填" />
        </el-form-item>

        <el-form-item>
          <div class="actions">
            <el-button type="primary" @click="handleSaveDraft" :loading="saving">保存草稿</el-button>
            <el-button type="success" @click="handleSubmit" :loading="submitting">提交申请</el-button>
          </div>
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
import { getUserLedClubs } from "@/api/club";
import { createActivityDraft, submitActivity, createActivity, getActivityDetail, updateActivityDraft } from "@/api/activity";
import { useUserStore } from "@/stores/user";

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();

const loading = ref(false);
const saving = ref(false);
const submitting = ref(false);
const formRef = ref<FormInstance>();
const myClubs = ref<any[]>([]);
const draftId = ref<number | null>(null);
const editingStatus = ref<string | null>(null);

const form = ref({
  clubId: undefined as number | undefined,
  name: "",
  description: "",
  coverImage: "",
  date: "",
  endAt: "",
  location: "",
});

const rules = {
  clubId: [{ required: true, message: "请选择社团", trigger: "change" }],
  name: [{ required: false }],
  description: [{ required: false }],
  date: [{ required: false }],
  endAt: [{ required: false }],
};

const BASE_URL = import.meta.env.VITE_API_BASE_URL.replace(/\/api\/?$/, "");
const uploadUrl = `${import.meta.env.VITE_API_BASE_URL}/activities/cover`;
const token = localStorage.getItem("token");
const headers = { Authorization: `Bearer ${token}` };

const coverUrl = computed(() => {
  if (!form.value.coverImage) return "";
  if (form.value.coverImage.startsWith("http")) return form.value.coverImage;
  return `${BASE_URL}${form.value.coverImage}`;
});

const fetchMyClubs = async () => {
  if (!userStore.user?.id) return;
  try {
    const res = await getUserLedClubs(userStore.user.id);
    myClubs.value = res;
    if (!form.value.clubId && res.length > 0) {
      form.value.clubId = (res[0] as any).id;
    }
  } catch (error: any) {
    ElMessage.error(error.message || "获取负责社团失败");
  }
};

const fetchEditingActivity = async () => {
  const id = route.query.id ? parseInt(route.query.id as string, 10) : NaN;
  if (!id || Number.isNaN(id)) return;
  loading.value = true;
  try {
    const res: any = await getActivityDetail(id);
    if (
      res.status === "PENDING" ||
      res.status === "ONGOING" ||
      res.status === "FINISHED" ||
      res.status === "APPROVED"
    ) {
      ElMessage.warning("该活动当前状态不可编辑");
      router.back();
      return;
    }
    draftId.value = res.id;
    editingStatus.value = res.status;
    form.value = {
      clubId: res.clubId,
      name: res.name || "",
      description: res.description || "",
      coverImage: res.coverImage || "",
      date: res.date || "",
      endAt: res.endAt || "",
      location: res.location || "",
    };
  } catch (error: any) {
    ElMessage.error(error.message || "获取活动信息失败");
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
  if (!isImg) ElMessage.error("封面图片只能是 JPG/PNG 格式!");
  if (!isLt5M) ElMessage.error("封面图片大小不能超过 5MB!");
  return isImg && isLt5M;
};

const handleSaveDraft = async () => {
  if (!form.value.clubId) {
    ElMessage.warning("请先选择所属社团");
    return;
  }
  saving.value = true;
  try {
    if (draftId.value) {
      await updateActivityDraft(draftId.value, {
        name: form.value.name,
        description: form.value.description,
        coverImage: form.value.coverImage,
        date: form.value.date,
        endAt: form.value.endAt,
        location: form.value.location,
      });
    } else {
      const res = await createActivityDraft({
        clubId: form.value.clubId,
        name: form.value.name,
        description: form.value.description,
        coverImage: form.value.coverImage,
        date: form.value.date,
        endAt: form.value.endAt,
        location: form.value.location,
      });
      draftId.value = (res as any).id;
    }
    ElMessage.success("草稿已保存");
  } catch (error: any) {
    ElMessage.error(error.message || "保存草稿失败");
  } finally {
    saving.value = false;
  }
};

const handleSubmit = async () => {
  if (!form.value.clubId) {
    ElMessage.warning("请先选择所属社团");
    return;
  }
  submitting.value = true;
  try {
    if (draftId.value) {
      await submitActivity(draftId.value, {
        name: form.value.name,
        description: form.value.description,
        coverImage: form.value.coverImage,
        date: form.value.date,
        endAt: form.value.endAt,
        location: form.value.location,
      });
    } else {
      await createActivity({
        clubId: form.value.clubId,
        name: form.value.name,
        description: form.value.description,
        coverImage: form.value.coverImage,
        date: form.value.date,
        endAt: form.value.endAt,
        location: form.value.location,
      });
    }
    ElMessage.success("已提交申请，等待审核");
    router.push("/leader/activities");
  } catch (error: any) {
    ElMessage.error(error.message || "提交失败");
  } finally {
    submitting.value = false;
  }
};

onMounted(() => {
  fetchMyClubs();
  fetchEditingActivity();
});
</script>

<style scoped>
.create-activity-container {
  max-width: 820px;
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

.actions {
  display: flex;
  gap: 12px;
}
</style>
