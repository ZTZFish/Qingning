
import { Request, Response } from "express";
import { getPendingCounts } from "../services/notification.service";
import { Role } from "@prisma/client";

export const getCounts = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const role = (req as any).user.role as Role;

    const counts = await getPendingCounts(userId, role);

    res.status(200).json({
      code: 200,
      message: "获取成功",
      data: counts,
    });
  } catch (error: any) {
    res.status(500).json({ code: 500, message: error.message });
  }
};
