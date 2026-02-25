// src/utils/file.ts

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * 删除服务器上的文件
 * @param relativePath 文件的相对路径（例如：/uploads/clubs/xxx.png）
 */
export const deleteFile = (relativePath: string | null | undefined) => {
  if (!relativePath) return;

  try {
    // 拼接绝对路径。注意：relativePath 以 /uploads 开头，所以需要去掉开头的 / 或者正确拼接
    // 假设项目根目录下的 public 文件夹是静态资源目录
    const absolutePath = path.join(__dirname, "../../public", relativePath);

    if (fs.existsSync(absolutePath)) {
      fs.unlinkSync(absolutePath);
      console.log(`Successfully deleted file: ${absolutePath}`);
    } else {
      console.warn(`File not found, skipping delete: ${absolutePath}`);
    }
  } catch (error) {
    console.error(`Error deleting file ${relativePath}:`, error);
  }
};
