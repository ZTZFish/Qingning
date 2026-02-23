import express from "express"; // 导入 express
import cors from "cors"; // 导入 cors（前端跨域）
import userRoutes from "./routes/user.routes"; // 导入用户路由
import authRoutes from "./routes/auth.routes"; // 导入认证路由
import path from "path"; // 导入 path 模块，用于处理文件路径
import { fileURLToPath } from "url"; // ES模块中必须导入这个方法

// 1. 获取当前文件的绝对路径（fileURLToPath 转换 import.meta.url）
const __filename = fileURLToPath(import.meta.url);
// 2. 获取当前文件所在目录的绝对路径（即模拟 __dirname）
const __dirname = path.dirname(__filename);

const app = express(); // 创建 Express 应用实例
app.use(express.json()); // 解析 JSON 请求体

// 启用 CORS，允许前端访问
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true, // 允许携带 cookie
  })
);

// 挂载路由
app.use("/api/users", userRoutes); // 用户资源相关
app.use("/api/auth", authRoutes); // 认证相关 (登录、验证码)

// 测试接口
app.get("/health", (_req, res) => {
  console.log("测试成功");
  res.json({ code: 200, data: { status: "ok" }, message: "Success" });
});

// 配置静态资源目录，让上传的图片可以被访问
app.use("/uploads", express.static(path.join(__dirname, "../public/uploads")));

const PORT = process.env.PORT || 3000; // 从 .env 取端口，默认 3000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
