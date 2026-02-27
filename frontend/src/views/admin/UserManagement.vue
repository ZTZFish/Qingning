<template>
  <div class="user-management">
    <CommonList
      title="用户管理"
      :data="users"
      :columns="columns"
      :total="total"
      :loading="loading"
      action-width="250"
      :current-page="currentPage"
      :page-size="pageSize"
      @page-change="handlePageChange"
    >
      <template #header-actions>
        <el-input
          v-model="searchQuery"
          placeholder="搜索用户名/真实姓名/学号"
          prefix-icon="Search"
          style="width: 240px"
          clearable
          @input="handleSearch"
        />
      </template>

      <template #actions="{ row }">
        <el-button
          v-if="row.role === Role.USER"
          type="primary"
          link
          @click="handleSetLeader(row)"
        >
          设为负责人
        </el-button>
        <el-button
          v-if="row.role === Role.LEADER"
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
          {{ row.isDeleted ? "解封" : "封禁" }}
        </el-button>
        <el-button type="info" link @click="handleViewDetail(row)"
          >详情</el-button
        >
      </template>
    </CommonList>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import CommonList from "@/components/CommonList.vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { Search } from "@element-plus/icons-vue";
import { Role, type Column, type User } from "@/types";
import { getAllUsers, adminUpdateUser } from "@/api/user";

const searchQuery = ref("");
const users = ref<User[]>([]);
const loading = ref(false);
const total = ref(0);
const currentPage = ref(1);
const pageSize = ref(10);

const columns: Column[] = [
  { label: "头像", prop: "avatar", type: "avatar", width: "80" },
  { label: "用户名", prop: "username", minWidth: "120" },
  { label: "真实姓名", prop: "realName", minWidth: "100" },
  { label: "学号", prop: "StudentId", width: "120" },
  {
    label: "角色",
    prop: "role",
    type: "tag",
    width: "120",
    tagMap: {
      [Role.ADMIN]: { label: "管理员", type: "danger" },
      [Role.LEADER]: { label: "负责人", type: "warning" },
      [Role.USER]: { label: "普通用户", type: "info" },
    },
  },
  {
    label: "状态",
    prop: "isDeleted",
    type: "tag",
    width: "100",
    tagMap: {
      false: { label: "正常", type: "success" },
      true: { label: "已封禁", type: "danger" },
    },
  },
];

const fetchUsers = async () => {
  loading.value = true;
  try {
    const data = await getAllUsers({
      page: currentPage.value,
      pageSize: pageSize.value,
      search: searchQuery.value,
    });
    users.value = data.list;
    total.value = data.total;
  } catch (error: any) {
    ElMessage.error(error.message || "获取列表失败");
  } finally {
    loading.value = false;
  }
};

const handleSearch = () => {
  currentPage.value = 1;
  fetchUsers();
};

const handlePageChange = (page: number) => {
  currentPage.value = page;
  fetchUsers();
};

onMounted(() => {
  fetchUsers();
});

const handleToggleStatus = async (row: User) => {
  try {
    const action = row.isDeleted ? "解封" : "封禁";
    await ElMessageBox.confirm(
      `确定要${action}用户 "${row.username}" 吗？`,
      "提示",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }
    );

    await adminUpdateUser(row.id, { isDeleted: !row.isDeleted });
    ElMessage.success(`${action}成功`);
    fetchUsers();
  } catch (error) {
    if (error !== "cancel") {
      console.error(error);
    }
  }
};

const handleSetLeader = async (row: User) => {
  try {
    await ElMessageBox.confirm(
      `确定要将用户 "${row.username}" 设为社团负责人吗？`,
      "提示",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }
    );

    await adminUpdateUser(row.id, { role: Role.LEADER });
    ElMessage.success("设置成功");
    fetchUsers();
  } catch (error) {
    if (error !== "cancel") {
      console.error(error);
    }
  }
};

const handleCancelLeader = async (row: User) => {
  try {
    await ElMessageBox.confirm(
      `确定要取消用户 "${row.username}" 的负责人权限吗？`,
      "提示",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }
    );

    await adminUpdateUser(row.id, { role: Role.USER });
    ElMessage.success("取消成功");
    fetchUsers();
  } catch (error) {
    if (error !== "cancel") {
      console.error(error);
    }
  }
};

const handleViewDetail = (row: User) => {
  ElMessageBox.alert(
    `
    <div style="text-align: left">
      <p><strong>ID:</strong> ${row.id}</p>
      <p><strong>用户名:</strong> ${row.username}</p>
      <p><strong>邮箱:</strong> ${row.email}</p>
      <p><strong>真实姓名:</strong> ${row.realName || "未设置"}</p>
      <p><strong>性别:</strong> ${
        row.sex === "MALE" ? "男" : row.sex === "FEMALE" ? "女" : "未知"
      }</p>
      <p><strong>学号:</strong> ${row.StudentId || "未设置"}</p>
      <p><strong>注册时间:</strong> ${new Date(
        row.createdAt
      ).toLocaleString()}</p>
    </div>
  `,
    "用户详情",
    {
      dangerouslyUseHTMLString: true,
    }
  );
};
</script>
