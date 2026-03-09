<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import {
  getAnnouncements,
  getAnnouncementDetail,
  markMessageRead,
  type Announcement,
} from "@/api/announcement";
import { useNotificationStore } from "@/stores/notification";

const router = useRouter();
const notificationStore = useNotificationStore();

const loadingMessages = ref(false);
const loadingAnnouncements = ref(false);

const messages = ref<Announcement[]>([]);
const announcements = ref<Announcement[]>([]);

const messagePage = ref(1);
const messagePageSize = ref(10);
const messageTotal = ref(0);

const announcementPage = ref(1);
const announcementPageSize = ref(10);
const announcementTotal = ref(0);

const dialogVisible = ref(false);
const dialogLoading = ref(false);
const dialogData = ref<Announcement | null>(null);

const isDialogMessage = computed(() => {
  if (!dialogData.value) return false;
  return !!dialogData.value.targetId && dialogData.value.targetId !== 0;
});

const isDialogUnreadMessage = computed(() => {
  return isDialogMessage.value && dialogData.value?.isRead === false;
});

const fetchMessages = async () => {
  loadingMessages.value = true;
  try {
    const res = await getAnnouncements({
      page: messagePage.value,
      pageSize: messagePageSize.value,
      type: "messages",
    });
    messages.value = res.list;
    messageTotal.value = res.total;
  } catch (error: any) {
    ElMessage.error(error.message || "获取个人消息失败");
  } finally {
    loadingMessages.value = false;
  }
};

const fetchAnnouncements = async () => {
  loadingAnnouncements.value = true;
  try {
    const res = await getAnnouncements({
      page: announcementPage.value,
      pageSize: announcementPageSize.value,
      type: "public",
    });
    announcements.value = res.list;
    announcementTotal.value = res.total;
  } catch (error: any) {
    ElMessage.error(error.message || "获取公告列表失败");
  } finally {
    loadingAnnouncements.value = false;
  }
};

const refreshAll = async () => {
  await Promise.all([
    fetchMessages(),
    fetchAnnouncements(),
    notificationStore.fetchCounts(),
  ]);
};

const handleMessagePageChange = (page: number) => {
  messagePage.value = page;
  fetchMessages();
};

const handleAnnouncementPageChange = (page: number) => {
  announcementPage.value = page;
  fetchAnnouncements();
};

const openDetail = async (row: Announcement) => {
  dialogVisible.value = true;
  dialogLoading.value = true;
  dialogData.value = null;
  try {
    const detail = await getAnnouncementDetail(row.id);
    dialogData.value = detail;
  } catch (error: any) {
    ElMessage.error(error.message || "获取详情失败");
    dialogVisible.value = false;
  } finally {
    dialogLoading.value = false;
  }
};

const handleAnnouncementRowClick = (row: Announcement) => {
  router.push(`/announcements/${row.id}`);
};

const handleMarkRead = async (row: Announcement) => {
  try {
    await markMessageRead(row.id);
    row.isRead = true;
    notificationStore.fetchCounts();
    ElMessage.success("已标记为已读");
  } catch (error: any) {
    ElMessage.error(error.message || "操作失败");
  }
};

const handleDialogMarkRead = async () => {
  if (!dialogData.value) return;
  await handleMarkRead(dialogData.value);
};

onMounted(() => {
  refreshAll();
});
</script>

<template>
  <div class="messages-page">
    <div class="columns">
      <el-card class="column" shadow="never">
        <template #header>
          <div class="card-title">
            <span>个人消息</span>
            <el-tag v-if="notificationStore.counts.unreadMessages > 0" type="danger">
              未读 {{ notificationStore.counts.unreadMessages }}
            </el-tag>
          </div>
        </template>

        <el-table
          :data="messages"
          v-loading="loadingMessages"
          size="default"
          style="width: 100%"
          @row-click="openDetail"
        >
          <el-table-column prop="title" label="标题" min-width="160" />
          <el-table-column prop="createdAt" label="时间" width="180" />
          <el-table-column label="状态" width="90">
            <template #default="{ row }">
              <el-tag :type="row.isRead ? 'info' : 'danger'">
                {{ row.isRead ? "已读" : "未读" }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="110" align="center">
            <template #default="{ row }">
              <el-button
                type="primary"
                link
                :disabled="row.isRead"
                @click.stop="handleMarkRead(row)"
              >
                已读
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <div class="pager">
          <el-pagination
            background
            layout="prev, pager, next"
            :current-page="messagePage"
            :page-size="messagePageSize"
            :total="messageTotal"
            @current-change="handleMessagePageChange"
          />
        </div>
      </el-card>

      <el-card class="column" shadow="never">
        <template #header>
          <div class="card-title">
            <span>公告列表</span>
          </div>
        </template>

        <el-table
          :data="announcements"
          v-loading="loadingAnnouncements"
          size="default"
          style="width: 100%"
          @row-click="handleAnnouncementRowClick"
        >
          <el-table-column prop="title" label="标题" min-width="160" />
          <el-table-column prop="createdAt" label="时间" width="180" />
          <el-table-column label="置顶" width="90">
            <template #default="{ row }">
              <el-tag v-if="row.pinned" type="danger">置顶</el-tag>
              <span v-else>-</span>
            </template>
          </el-table-column>
        </el-table>

        <div class="pager">
          <el-pagination
            background
            layout="prev, pager, next"
            :current-page="announcementPage"
            :page-size="announcementPageSize"
            :total="announcementTotal"
            @current-change="handleAnnouncementPageChange"
          />
        </div>
      </el-card>
    </div>

    <el-dialog v-model="dialogVisible" title="详情" width="720px">
      <div v-loading="dialogLoading" class="dialog-body">
        <template v-if="dialogData">
          <div class="dialog-header">
            <div class="dialog-title">{{ dialogData.title }}</div>
            <div class="dialog-meta">
              <span>{{ dialogData.createdAt }}</span>
              <el-tag v-if="isDialogMessage" :type="dialogData.isRead ? 'info' : 'danger'">
                {{ dialogData.isRead ? "已读" : "未读" }}
              </el-tag>
            </div>
          </div>

          <div class="dialog-content">{{ dialogData.content }}</div>
        </template>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">关闭</el-button>
          <el-button
            v-if="isDialogUnreadMessage"
            type="primary"
            @click="handleDialogMarkRead"
          >
            标记已读
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.messages-page {
  padding: 20px;
}

.columns {
  display: flex;
  gap: 16px;
}

.column {
  flex: 1;
  min-width: 0;
}

.card-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.pager {
  margin-top: 12px;
  display: flex;
  justify-content: flex-end;
}

.dialog-body {
  min-height: 180px;
}

.dialog-header {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 12px;
}

.dialog-title {
  font-size: 16px;
  font-weight: 600;
}

.dialog-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #909399;
  font-size: 12px;
}

.dialog-content {
  white-space: pre-wrap;
  line-height: 1.7;
  color: #303133;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>
