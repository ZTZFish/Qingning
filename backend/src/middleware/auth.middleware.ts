import { Request, Response, NextFunction } from "express"; // 导入 Express 类型
import jwt from "jsonwebtoken"; // 导入 jsonwebtoken 用于验证 token

// JWT 验证中间件
export const authenticateJWT = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // 从请求头 Authorization 中取 token（格式：Bearer <token>）
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ code: 401, message: "Unauthorized" });
  }

  // 提取 token 字符串
  const token = authHeader.split(" ")[1];

  try {
    // 使用 jwt.verify 验证 token，密钥从 .env 取
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      userId: number;
      role: string;
    };

    // 把解码后的用户 id 和 role 附加到 req.user 上，供后续控制器使用
    req.user = { id: decoded.userId, role: decoded.role };

    // 调用 next() 继续下一个中间件或控制器
    next();
  } catch (error) {
    // token 无效，返回 403 禁止访问
    return res.status(403).json({ code: 403, message: "Invalid token" });
  }
};

// 角色检查中间件（可选，用于限制 admin only 等）
export const checkRole =
  (roles: string[]) => (req: Request, res: Response, next: NextFunction) => {
    // 检查 req.user.role 是否在允许的 roles 数组中
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ code: 403, message: "Access denied" });
    }
    // 通过，调用 next()
    next();
  };
