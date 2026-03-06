
<template>
  <div class="announcement-list">
    <CommonList
      title="公告管理"
      :data="announcements"
      :columns="columns"
      :total="total"
      :loading="loading"
      :current-page="currentPage"
      :page-size="pageSize"
      @page-change="handlePageChange"
      @row-click="handleRowClick"
    >
      <template #header-actions>
        <el-button type="primary" @click="handleCreate">
          发布公告
        </el-button>
        <el-input
          v-model="searchQuery"
          placeholder="搜索公告标题"
          prefix-icon="Search"
          style="width: 240px; margin-left: 12px"
          clearable
          @input="handleSearch"
        />
      </template>

      <template #actions="{ row }">
        <el-button type="primary" link @click.stop="handleEdit(row)">
          编辑
        </el-button>
        <el-button type="danger" link @click.stop="handleDelete(row)">
          删除
        </el-button>
      </template>
    </CommonList>

    <!-- 发布/编辑公告弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? '编辑公告' : '发布公告'"
      width="600px"
      @close="resetForm"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="80px"
      >
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入公告标题" />
        </el-form-item>
        <el-form-item label="置顶" prop="pinned">
          <el-switch v-model="form.pinned" />
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <el-input
            v-model="form.content"
            type="textarea"
            :rows="6"
            placeholder="请输入公告内容"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit" :loading="submitting">
            确定
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { ElMessage, ElMessageBox } from "element-plus";
import { Search } from "@element-plus/icons-vue";
import CommonList from "@/components/CommonList.vue";
import {
  getAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
} from "@/api/announcement";
import type { Column } from "@/types";

const router = useRouter();
const announcements = ref<any[]>([]);
const total = ref(0);
const loading = ref(false);
const currentPage = ref(1);
const pageSize = ref(10);
const searchQuery = ref("");

const dialogVisible = ref(false);
const isEdit = ref(false);
const submitting = ref(false);
const currentId = ref<number | null>(null);
const formRef = ref();

const form = ref({
  title: "",
  content: "",
  pinned: false,
});

const rules = {
  title: [{ required: true, message: "请输入标题", trigger: "blur" }],
  content: [{ required: true, message: "请输入内容", trigger: "blur" }],
};

const columns: Column[] = [
  { label: "标题", prop: "title", minWidth: "200" },
  { label: "发布者", prop: "author.realName", width: "120" }, // 假设后端返回 author 对象
  { label: "发布时间", prop: "createdAt", width: "180" },
  {
    label: "置顶",
    prop: "pinned",
    width: "80",
    type: "tag",
    tagMap: {
      true: { label: "是", type: "danger" },
      false: { label: "否", type: "info" },
    },
  },
];

const fetchData = async () => {
  loading.value = true;
  try {
    const res = await getAnnouncements({
      page: currentPage.value,
      pageSize: pageSize.value,
      search: searchQuery.value,
    });
    announcements.value = res.list;
    total.value = res.total;
  } catch (error: any) {
    ElMessage.error(error.message || "获取公告列表失败");
  } finally {
    loading.value = false;
  }
};

const handleSearch = () => {
  currentPage.value = 1;
  fetchData();
};

const handlePageChange = (page: number) => {
  currentPage.value = page;
  fetchData();
};

const handleCreate = () => {
  isEdit.value = false;
  currentId.value = null;
  form.value = {
    title: "",
    content: "",
    pinned: false,
  };
  dialogVisible.value = true;
};

const handleEdit = (row: any) => {
  isEdit.value = true;
  currentId.value = row.id;
  form.value = {
    title: row.title,
    content: row.content,
    pinned: row.pinned,
  };
  dialogVisible.value = true;
};

const handleDelete = (row: any) => {
  ElMessageBox.confirm("确定要删除该公告吗？", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      try {
        await deleteAnnouncement(row.id);
        ElMessage.success("删除成功");
        fetchData();
      } catch (error: any) {
        ElMessage.error(error.message || "删除失败");
      }
    })
    .catch(() => { });
};

const handleSubmit = async () => {
  if (!formRef.value) return;
  await formRef.value.validate(async (valid: boolean) => {
    if (valid) {
      submitting.value = true;
      try {
        if (isEdit.value && currentId.value) {
          await updateAnnouncement(currentId.value, form.value);
          ElMessage.success("更新成功");
        } else {
          await createAnnouncement(form.value);
          ElMessage.success("发布成功");
        }
        dialogVisible.value = false;
        fetchData();
      } catch (error: any) {
        ElMessage.error(error.message || "操作失败");
      } finally {
        submitting.value = false;
      }
    }
  });
};

const resetForm = () => {
  if (formRef.value) {
    formRef.value.resetFields();
  }
};

const handleRowClick = (row: any) => {
  router.push(`/announcements/${row.id}`);
};

onMounted(() => {
  fetchData();
});
</script>

<style scoped>
.announcement-list {
  padding: 20px;
}
</style>
