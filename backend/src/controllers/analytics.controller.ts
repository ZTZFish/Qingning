import { Request, Response } from "express";
import { getAdminAnalyticsOverview } from "../services/analytics.service";

export const getOverview = async (req: Request, res: Response) => {
  try {
    const daysRaw = req.query.days as string | undefined;
    const days = daysRaw ? parseInt(daysRaw, 10) : 30;
    const data = await getAdminAnalyticsOverview(days);
    res.status(200).json({ code: 200, message: "获取成功", data });
  } catch (error: any) {
    res.status(500).json({ code: 500, message: error.message });
  }
};
