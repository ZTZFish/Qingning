import express from "express";
import cors from "cors";

const app = express();

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 测试接口
app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

// 启动
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
