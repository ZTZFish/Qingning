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
    <el-dialog v-model="ledClubsDialogVisible" title="负责社团管理" width="600px">
      <div v-if="currentLedClubs.length > 0">
        <p>该用户负责以下社团，请选择要转移负责人的社团：</p>
        <el-table :data="currentLedClubs" style="width: 100%">
          <el-table-column prop="name" label="社团名称" />
          <el-table-column label="操作" width="150">
            <template #default="{ row }">
              <el-button type="primary" link @click="handleTransferClick(row)"
                >转移负责人</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-else class="empty-tip">该用户当前未负责任何社团。</div>
    </el-dialog>

    <el-dialog v-model="transferDialogVisible" title="选择新负责人" width="500px">
      <el-form>
        <el-form-item label="社团名称">
          <el-input v-model="currentTransferClub.name" disabled />
        </el-form-item>
        <el-form-item label="新负责人">
          <el-select
            v-model="newLeaderId"
            filterable
            remote
            reserve-keyword
            placeholder="请输入真实姓名搜索"
            :remote-method="searchNewLeader"
            :loading="searchLoading"
          >
            <el-option
              v-for="item in userOptions"
              :key="item.id"
              :label="`${item.realName} (${item.username})`"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="transferDialogVisible = false">取消</el-button>
          <el-button
            type="primary"
            @click="confirmTransfer"
            :loading="transferLoading"
            >确认转移</el-button
          >
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import CommonList from "@/components/CommonList.vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { Search } from "@element-plus/icons-vue";
import { Role, type Column, type User } from "@/types";
import { getAllUsers, adminUpdateUser } from "@/api/user";
import { getUserLedClubs, transferClubLeader } from "@/api/club";

const searchQuery = ref("");
const users = ref<User[]>([]);
const loading = ref(false);
const total = ref(0);
const currentPage = ref(1);
const pageSize = ref(10);

// 负责人管理相关
const ledClubsDialogVisible = ref(false);
const currentLedClubs = ref<any[]>([]);
const transferDialogVisible = ref(false);
const currentTransferClub = ref<any>({});
const newLeaderId = ref<number | undefined>(undefined);
const userOptions = ref<User[]>([]);
const searchLoading = ref(false);
const transferLoading = ref(false);

const columns: Column[] = [
  { label: "头像", prop: "avatar", type: "avatar", width: "80" },
  { label: "用户名", prop: "username", minWidth: "120" },
  { label: "真实姓名", prop: "realName", width: "120" },
  { label: "学号", prop: "studentId", width: "120" },
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
    // 1. 获取该用户负责的社团列表
    const clubs = await getUserLedClubs(row.id);

    if (clubs.length === 0) {
      // 如果没有负责任何社团，直接取消负责人身份
      await ElMessageBox.confirm(
        `用户 "${row.username}" 当前未负责任何社团，确定要取消其负责人权限吗？`,
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
    } else {
      // 如果有负责的社团，显示弹窗
      currentLedClubs.value = clubs;
      ledClubsDialogVisible.value = true;
    }
  } catch (error: any) {
    if (error !== "cancel") {
      ElMessage.error(error.message || "操作失败");
    }
  }
};

const handleTransferClick = (club: any) => {
  currentTransferClub.value = club;
  newLeaderId.value = undefined;
  userOptions.value = [];
  transferDialogVisible.value = true;
};

const searchNewLeader = async (query: string) => {
  if (query) {
    searchLoading.value = true;
    try {
      // 复用 getAllUsers 接口进行搜索，只取前 20 条
      const res = await getAllUsers({
        page: 1,
        pageSize: 20,
        search: query,
      });
      userOptions.value = res.list.filter((u) => u.role !== Role.ADMIN); // 排除管理员
    } catch (error) {
      console.error(error);
    } finally {
      searchLoading.value = false;
    }
  } else {
    userOptions.value = [];
  }
};

const confirmTransfer = async () => {
  if (!newLeaderId.value) {
    ElMessage.warning("请选择新负责人");
    return;
  }

  transferLoading.value = true;
  try {
    await transferClubLeader(currentTransferClub.value.id, newLeaderId.value);
    ElMessage.success("转让成功");
    transferDialogVisible.value = false;

    // 刷新负责社团列表
    // 注意：这里的 currentLedClubs 是属于 handleCancelLeader 中点击的那个 row (用户) 的
    // 我们需要重新获取该用户的负责社团，但 row 在这里访问不到，需要存一下
    // 简单起见，我们直接从 currentLedClubs 中移除已转让的社团
    const clubId = currentTransferClub.value.id;
    currentLedClubs.value = currentLedClubs.value.filter((c) => c.id !== clubId);

    // 如果列表空了，说明该用户不再负责任何社团，且后端逻辑应该已经将其降级为普通用户
    // 刷新主列表以更新状态
    if (currentLedClubs.value.length === 0) {
      ledClubsDialogVisible.value = false;
    }
    fetchUsers();
  } catch (error: any) {
    ElMessage.error(error.message || "转让失败");
  } finally {
    transferLoading.value = false;
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
      <p><strong>性别:</strong> ${row.sex === "MALE" ? "男" : row.sex === "FEMALE" ? "女" : "未知"
    }</p>
      <p><strong>学号:</strong> ${row.studentId || "未设置"}</p>
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
