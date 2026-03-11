<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from "vue";
import { ElMessage } from "element-plus";
import { getAdminAnalyticsOverview, type AdminAnalyticsOverview } from "@/api/analytics";
import * as echarts from "echarts";

const loading = ref(false);
const days = ref(30);
const data = ref<AdminAnalyticsOverview | null>(null);

const trendRef = ref<HTMLDivElement | null>(null);
const activityStatusRef = ref<HTMLDivElement | null>(null);
const clubTypeRef = ref<HTMLDivElement | null>(null);
const messageRef = ref<HTMLDivElement | null>(null);

let trendChart: echarts.ECharts | null = null;
let activityStatusChart: echarts.ECharts | null = null;
let clubTypeChart: echarts.ECharts | null = null;
let messageChart: echarts.ECharts | null = null;

const onResize = () => {
  trendChart?.resize();
  activityStatusChart?.resize();
  clubTypeChart?.resize();
  messageChart?.resize();
};

const clubTypeMap: Record<string, string> = {
  ACADEMIC: "学术类",
  SPORTS: "体育类",
  ARTS: "文艺类",
  VOLUNTEER: "志愿公益类",
  TECH: "科技类",
  ENTERTAINMENT: "娱乐类",
  OTHER: "其他",
};

const activityStatusMap: Record<string, string> = {
  DRAFT: "草稿",
  PENDING: "待审核",
  APPROVED: "已通过",
  REJECTED: "已驳回",
  ONGOING: "进行中",
  FINISHED: "已结束",
  CANCELED: "已取消",
};

const initChartsIfNeeded = () => {
  if (trendRef.value && !trendChart) trendChart = echarts.init(trendRef.value);
  if (activityStatusRef.value && !activityStatusChart)
    activityStatusChart = echarts.init(activityStatusRef.value);
  if (clubTypeRef.value && !clubTypeChart)
    clubTypeChart = echarts.init(clubTypeRef.value);
  if (messageRef.value && !messageChart)
    messageChart = echarts.init(messageRef.value);
};

const renderCharts = () => {
  const overview = data.value;
  if (!overview) return;

  initChartsIfNeeded();

  const ts = overview.timeSeries;
  trendChart?.setOption(
    {
      tooltip: { trigger: "axis" },
      legend: { top: 0, left: 0 },
      grid: { left: 36, right: 16, top: 42, bottom: 24, containLabel: true },
      xAxis: {
        type: "category",
        boundaryGap: false,
        data: ts.dates,
        axisLabel: { color: "#606266" },
      },
      yAxis: {
        type: "value",
        axisLabel: { color: "#606266" },
        splitLine: { lineStyle: { color: "#f0f2f5" } },
      },
      series: [
        {
          name: "新增用户",
          type: "line",
          smooth: true,
          showSymbol: false,
          data: ts.users,
          areaStyle: { opacity: 0.08 },
          lineStyle: { width: 2, color: "#00A69A" },
          itemStyle: { color: "#00A69A" },
        },
        {
          name: "新增社团",
          type: "line",
          smooth: true,
          showSymbol: false,
          data: ts.clubs,
          areaStyle: { opacity: 0.06 },
          lineStyle: { width: 2, color: "#409EFF" },
          itemStyle: { color: "#409EFF" },
        },
        {
          name: "新增活动",
          type: "line",
          smooth: true,
          showSymbol: false,
          data: ts.activities,
          areaStyle: { opacity: 0.06 },
          lineStyle: { width: 2, color: "#E6A23C" },
          itemStyle: { color: "#E6A23C" },
        },
        {
          name: "个人消息",
          type: "line",
          smooth: true,
          showSymbol: false,
          data: ts.personalMessages,
          areaStyle: { opacity: 0.06 },
          lineStyle: { width: 2, color: "#F56C6C" },
          itemStyle: { color: "#F56C6C" },
        },
      ],
    },
    { notMerge: true }
  );

  const activityRaw = overview.breakdown.activitiesByStatus || {};
  const activityPie = Object.keys(activityRaw)
    .map((k) => ({
      name: activityStatusMap[k] || k,
      value: activityRaw[k] || 0,
    }))
    .filter((x) => x.value > 0);
  activityStatusChart?.setOption(
    {
      tooltip: { trigger: "item" },
      legend: { top: 0, left: 0 },
      series: [
        {
          name: "活动状态",
          type: "pie",
          radius: ["40%", "68%"],
          center: ["50%", "58%"],
          avoidLabelOverlap: true,
          label: { formatter: "{b}\n{c}（{d}%）" },
          data: activityPie.length > 0 ? activityPie : [{ name: "暂无数据", value: 1 }],
        },
      ],
    },
    { notMerge: true }
  );

  const clubTypeRaw = overview.breakdown.clubsByType || {};
  const clubTypeItems = Object.entries(clubTypeRaw)
    .map(([k, v]) => ({ key: clubTypeMap[k] || k, value: v }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10);
  clubTypeChart?.setOption(
    {
      tooltip: { trigger: "axis", axisPointer: { type: "shadow" } },
      grid: { left: 12, right: 12, top: 10, bottom: 10, containLabel: true },
      xAxis: { type: "value", axisLabel: { color: "#606266" } },
      yAxis: {
        type: "category",
        data: clubTypeItems.map((x) => x.key),
        axisLabel: { color: "#606266" },
      },
      series: [
        {
          type: "bar",
          data: clubTypeItems.map((x) => x.value),
          itemStyle: { color: "#409EFF", borderRadius: [6, 6, 6, 6] },
          barWidth: 14,
        },
      ],
    },
    { notMerge: true }
  );

  const t = overview.totals;
  const unread = t.messagesUnread;
  const read = Math.max(0, t.messagesPersonal - unread);
  messageChart?.setOption(
    {
      tooltip: { trigger: "item" },
      legend: { top: 0, left: 0 },
      series: [
        {
          name: "个人消息",
          type: "pie",
          radius: ["42%", "70%"],
          center: ["50%", "58%"],
          label: { formatter: "{b}\n{c}（{d}%）" },
          data:
            t.messagesPersonal > 0
              ? [
                { name: "未读", value: unread },
                { name: "已读", value: read },
              ]
              : [{ name: "暂无数据", value: 1 }],
        },
      ],
    },
    { notMerge: true }
  );
};

const fetchData = async () => {
  loading.value = true;
  try {
    data.value = await getAdminAnalyticsOverview({ days: days.value });
    await nextTick();
    renderCharts();
  } catch (error: any) {
    ElMessage.error(error.message || "获取数据分析失败");
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchData();
  window.addEventListener("resize", onResize);
});

const kpis = computed(() => {
  const t = data.value?.totals;
  if (!t) return [];
  return [
    { label: "用户总数", value: t.users },
    { label: "已通过社团", value: t.clubsApproved },
    { label: "活动总数", value: t.activities },
    { label: "公共公告", value: t.announcementsPublic },
    { label: "个人消息", value: t.messagesPersonal },
    { label: "未读消息", value: t.messagesUnread },
  ];
});

const topClubs = computed(() => {
  const list = data.value?.topClubsByMembers || [];
  return list.map((x) => ({
    ...x,
    typeName: clubTypeMap[x.type] || x.type,
  }));
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", onResize);
  trendChart?.dispose();
  activityStatusChart?.dispose();
  clubTypeChart?.dispose();
  messageChart?.dispose();
  trendChart = null;
  activityStatusChart = null;
  clubTypeChart = null;
  messageChart = null;
});
</script>

<template>
  <div class="analytics-page" v-loading="loading">
    <div class="header">
      <div class="title">数据分析</div>
      <div class="actions">
        <el-select v-model="days" style="width: 160px" @change="fetchData">
          <el-option :value="7" label="近 7 天" />
          <el-option :value="30" label="近 30 天" />
          <el-option :value="90" label="近 90 天" />
        </el-select>
        <el-button type="primary" @click="fetchData">刷新</el-button>
      </div>
    </div>

    <div class="kpi-grid">
      <el-card v-for="item in kpis" :key="item.label" shadow="never" class="kpi-card">
        <div class="kpi-label">{{ item.label }}</div>
        <div class="kpi-value">{{ item.value }}</div>
      </el-card>
    </div>

    <div class="grid">
      <el-card shadow="never" class="card span-2">
        <template #header>
          <div class="card-title">近 {{ days }} 天趋势</div>
        </template>
        <div ref="trendRef" class="chart chart-lg"></div>
      </el-card>

      <el-card shadow="never" class="card">
        <template #header>
          <div class="card-title">活动状态分布</div>
        </template>
        <div ref="activityStatusRef" class="chart"></div>
      </el-card>

      <el-card shadow="never" class="card">
        <template #header>
          <div class="card-title">社团类型分布（TOP 10）</div>
        </template>
        <div ref="clubTypeRef" class="chart"></div>
      </el-card>

      <el-card shadow="never" class="card">
        <template #header>
          <div class="card-title">个人消息已读情况</div>
        </template>
        <div ref="messageRef" class="chart"></div>
      </el-card>

      <el-card shadow="never" class="card span-2">
        <template #header>
          <div class="card-title">成员数 TOP 社团（已通过成员）</div>
        </template>
        <el-table :data="topClubs" size="small" style="width: 100%">
          <el-table-column prop="name" label="社团" min-width="180" />
          <el-table-column prop="typeName" label="类型" width="120" />
          <el-table-column prop="approvedMembers" label="成员数" width="120" />
        </el-table>
      </el-card>
    </div>
  </div>
</template>

<style scoped>
.analytics-page {
  padding: 20px;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.title {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}

.actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.kpi-grid {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 12px;
  margin-bottom: 16px;
}

.kpi-card {
  border-radius: 12px;
}

.kpi-label {
  font-size: 12px;
  color: #909399;
  margin-bottom: 6px;
}

.kpi-value {
  font-size: 22px;
  font-weight: 700;
  color: #303133;
}

.grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.card {
  border-radius: 12px;
}

.card-title {
  font-weight: 600;
}

.span-2 {
  grid-column: span 2;
}

.chart {
  width: 100%;
  height: 320px;
}

.chart-lg {
  height: 360px;
}

@media (max-width: 1400px) {
  .kpi-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (max-width: 1024px) {
  .grid {
    grid-template-columns: 1fr;
  }

  .span-2 {
    grid-column: span 1;
  }
}
</style>
