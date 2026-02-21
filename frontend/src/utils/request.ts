import axios from "axios";
import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

import type { ResponseData } from "@/types";

// 从环境变量中获取配置
const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const TIMEOUT = Number(import.meta.env.VITE_TIMEOUT) || 10000;

// 创建 axios 实例
const service: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: TIMEOUT,
  headers: {
    "Content-Type": "application/json;charset=utf-8",
  },
});

// 请求拦截器
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 在这里可以添加 token 等请求头
    const token = localStorage.getItem("token");
    if (token && config.headers) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error: any) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse) => {
    const res = response.data;

    // 如果返回的状态码不是 200 或 201，则认为是错误
    if (res.code !== 200 && res.code !== 0 && res.code !== 201) {
      // 这里可以根据具体的业务逻辑进行处理，比如弹出错误提示
      console.error(res.message || "Error");
      return Promise.reject(new Error(res.message || "Error"));
    }

    return res.data;
  },
  (error: any) => {
    console.error("err" + error);
    // 提取后端返回的错误信息
    const message =
      error.response?.data?.message || error.message || "请求失败";
    return Promise.reject(new Error(message));
  }
);

/**
 * 封装常用的请求方法
 */
const request = {
  get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return service.get(url, config);
  },

  post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    return service.post(url, data, config);
  },

  put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    return service.put(url, data, config);
  },

  delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return service.delete(url, config);
  },
};

export default request;
