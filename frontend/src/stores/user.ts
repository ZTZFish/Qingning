import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { User } from "@/types";
import { getUserInfo } from "@/api/user";
import { Role } from "@/types";

export const useUserStore = defineStore("user", () => {
  const token = ref<string | null>(localStorage.getItem("token"));
  const user = ref<User | null>(null);

  const isAuthenticated = computed(() => !!token.value);
  const userRole = computed(() => user.value?.role);

  // 设置 Token
  function setToken(newToken: string) {
    token.value = newToken;
    localStorage.setItem("token", newToken);
  }

  // 清除 Token 和用户信息（登出）
  function logout() {
    token.value = null;
    user.value = null;
    localStorage.removeItem("token");
  }

  // 获取用户信息
  async function fetchUserInfo() {
    if (!token.value) return null;
    try {
      const res = await getUserInfo();
      if (res) {
        user.value = res;
        console.log("用户信息:", res);
        return res;
      }
    } catch (error) {
      console.error("获取用户信息失败", error);
      logout(); // 获取失败通常意味着 Token 失效
      throw error;
    }
    return null;
  }

  // 检查是否有权限
  function hasPermission(roles: Role[] = []) {
    if (!roles || roles.length === 0) return true;
    if (!user.value) return false;
    // ADMIN 拥有所有权限
    if (user.value.role === Role.ADMIN) return true;
    return roles.includes(user.value.role);
  }

  return {
    token,
    user,
    isAuthenticated,
    userRole,
    setToken,
    logout,
    fetchUserInfo,
    hasPermission,
  };
});
