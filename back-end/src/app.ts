import express from "express"; // 导入 express
import cors from "cors"; // 导入 cors（前端跨域）
import userRoutes from "./routes/user.routes"; // 导入用户路由

const app = express(); // 创建 Express 应用实例
app.use(express.json()); // 解析 JSON 请求体

// 启用 CORS，允许前端访问
app.use(
  cors({
    origin: "http://localhost:5173", // 替换为你前端的实际地址
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true, // 如果需要跨域携带 Cookie
  })
);

// 挂载用户路由到 /api/users
app.use("/api/users", userRoutes);

// 测试接口
app.get("/health", (_req, res) => {
  console.log("测试成功");
  res.json({ code: 200, data: { status: "ok" }, message: "Success" });
});

const PORT = process.env.PORT || 3000; // 从 .env 取端口，默认 3000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
