import multer, { MulterError } from "multer";
import path from "path";
import fs from "fs";
import { Request, Response, NextFunction } from "express";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 确保目录存在
const ensureDir = (dirPath: string) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

// 配置存储
const storage = (subDir: string) =>
  multer.diskStorage({
    destination: (_req: Request, _file, cb) => {
      // 使用基于 __dirname 的相对路径，确保无论从哪个目录启动服务器都能找到正确的 public 目录
      const uploadPath = path.join(__dirname, "../../public/uploads", subDir);
      ensureDir(uploadPath);
      cb(null, uploadPath);
    },
    filename: (req: Request, file, cb) => {
      // 获取文件扩展名
      const ext = path.extname(file.originalname);
      // 生成唯一文件名: 用户ID(如果有) + 时间戳 + 随机数 + 扩展名
      // 注意：req.user 是在 auth.middleware 中设置的，如果未登录则可能不存在，
      // 但上传头像通常需要登录，所以这里假设 req.user 存在或者使用 'guest'
      const userId = (req as any).user?.id || "guest";
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, `${userId}-${uniqueSuffix}${ext}`);
    },
  });

// 文件过滤器
const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("只允许上传图片文件 (jpeg, png, gif, webp)"));
  }
};

// 导出创建上传中间件的函数
export const createUploadMiddleware = (subDir: string) => {
  const upload = multer({
    storage: storage(subDir),
    fileFilter: fileFilter,
    limits: {
      fileSize: 5 * 1024 * 1024, // 限制 5MB
    },
  });

  return {
    single:
      (fieldName: string) =>
      (req: Request, res: Response, next: NextFunction) => {
        upload.single(fieldName)(req, res, (err: any) => {
          if (err) {
            if (err instanceof MulterError) {
              if (err.code === "LIMIT_FILE_SIZE") {
                return res
                  .status(400)
                  .json({ code: 400, message: "文件体积过大，不能超过 5MB" });
              }
              return res
                .status(400)
                .json({ code: 400, message: `上传错误: ${err.message}` });
            }
            return res.status(400).json({ code: 400, message: err.message });
          }
          next();
        });
      },
  };
};
