import { createRouter, createWebHistory } from "vue-router";
import { useUserStore } from "@/stores/user";
import { ElMessage } from "element-plus";
import { Role } from "@/types";

const routes = [
  {
    path: "/login",
    name: "login",
    component: () => import("../views/Login.vue"),
    meta: { title: "登录 - 青柠社团管理系统", requiresAuth: false },
  },
  {
    path: "/",
    component: () => import("../components/MainLayout.vue"),
    redirect: "/login",
    meta: { requiresAuth: true }, // 父路由需要认证
    children: [
      {
        path: "home",
        name: "home",
        component: () => import("../views/Home.vue"),
        meta: { title: "首页 - 青柠社团管理系统" },
      },
      {
        path: "settings",
        name: "settings",
        component: () => import("../views/UserSettings.vue"),
        meta: { title: "个人设置 - 青柠社团管理系统" },
      },
      // 管理员专用路由
      {
        path: "admin/users",
        name: "admin-users",
        component: () => import("../views/admin/UserManagement.vue"),
        meta: { roles: [Role.ADMIN], title: "用户管理 - 青柠社团管理系统" },
      },
      {
        path: "admin/clubs",
        name: "admin-clubs",
        component: () => import("../views/admin/ClubManagement.vue"),
        meta: { roles: [Role.ADMIN], title: "社团管理 - 青柠社团管理系统" },
      },
      {
        path: "admin/activities",
        name: "admin-activities",
        component: () => import("../views/admin/ActivityManagement.vue"),
        meta: { roles: [Role.ADMIN], title: "活动管理 - 青柠社团管理系统" },
      },
      {
        path: "admin/audit",
        name: "admin-audit",
        component: () => import("../views/admin/ContentAudit.vue"),
        meta: { roles: [Role.ADMIN], title: "内容审批 - 青柠社团管理系统" },
      },
      {
        path: "clubs",
        name: "discover-clubs",
        component: () => import("@/views/club/ClubCardList.vue"),
        props: { mode: "discover" },
      },
      {
        path: "my",
        name: "my-clubs",
        component: () => import("@/views/club/ClubCardList.vue"),
        props: { mode: "joined" },
        meta: { requiresAuth: true },
      },
      {
        path: "clubs/:id",
        name: "club-detail",
        component: () => import("@/views/club/ClubDetail.vue"),
        meta: { requiresAuth: true },
      },
      {
        path: "activities",
        name: "activities",
        component: () => import("@/views/activity/ActivityList.vue"),
      },
      {
        path: "create-club",
        name: "create-club",
        component: () => import("@/views/user/CreateClub.vue"),
        meta: { requiresAuth: true },
      },
    ],
  },
  {
    path: "/leader",
    component: () => import("../components/MainLayout.vue"),
    meta: { requiresAuth: true, roles: [Role.LEADER] },
    children: [
      {
        path: "club",
        name: "leader-club",
        component: () => import("@/views/club/ClubCardList.vue"),
        props: { mode: "managed" },
      },
      {
        path: "club/:id/edit",
        name: "club-edit",
        component: () => import("@/views/leader/ClubEdit.vue"),
        meta: { roles: [Role.LEADER, Role.ADMIN] },
      },
      {
        path: "activities",
        name: "leader-activities",
        component: () => import("@/views/admin/ActivityManagement.vue"),
      },
      {
        path: "join-apply",
        name: "join-apply",
        component: () => import("@/views/leader/JoinApply.vue"),
      },
      {
        path: "add-activity",
        name: "add-activity",
        component: () => import("@/views/admin/ActivityManagement.vue"), // 暂时复用，之后应该替换为 CreateActivity.vue
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach(async (to, from, next) => {
  // 获取 User Store 实例（注意：需要在 router 钩子中获取，因为 router 初始化可能早于 pinia）
  // 但我们使用的是 composition API setup store，需要确保 pinia 已经 active。
  // 在 main.ts 中 app.use(pinia) 后 app.use(router)，所以在导航守卫执行时 pinia 已经好了。
  const userStore = useUserStore();
  const token = localStorage.getItem("token");

  // 1. 检查是否需要认证
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!token) {
      // 未登录 -> 重定向到登录页
      ElMessage.warning("请先登录");
      next({
        path: "/login",
        query: { redirect: to.fullPath }, // 保存原目标路径，以便登录后跳转
      });
      return;
    }

    // 已登录但 Store 中无用户信息 -> 尝试获取用户信息
    if (!userStore.user) {
      try {
        await userStore.fetchUserInfo();
      } catch (error) {
        // 获取失败（Token 无效等） -> 清除 Token 并重定向登录
        userStore.logout();
        ElMessage.error("登录已过期，请重新登录");
        next({ path: "/login" });
        return;
      }
    }

    // 3. 检查权限
    const requiredRoles = to.meta.roles as Role[] | undefined;
    if (requiredRoles && requiredRoles.length > 0) {
      if (!userStore.hasPermission(requiredRoles)) {
        // 权限不足
        ElMessage.error("权限不足，无法访问该页面");
        // 可以重定向到 403 页面，这里简单处理为取消导航或留在原处（如果 from.name 存在）
        // 或者重定向到首页
        next({ name: "home" });
        return;
      }
    }
  }

  next();
});

export default router;
