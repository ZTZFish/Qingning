import { Request, Response } from "express";
import { getPersonalizedRecommendations } from "../services/recommendation.service";

export const getRecommendations = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const clubs = req.query.clubs ? parseInt(req.query.clubs as string, 10) : 6;
    const activities = req.query.activities
      ? parseInt(req.query.activities as string, 10)
      : 6;
    const data = await getPersonalizedRecommendations(userId, {
      clubs: Math.max(1, Math.min(20, clubs)),
      activities: Math.max(1, Math.min(20, activities)),
    });
    res.status(200).json({ code: 200, message: "获取成功", data });
  } catch (error: any) {
    res.status(400).json({ code: 400, message: error.message });
  }
};
