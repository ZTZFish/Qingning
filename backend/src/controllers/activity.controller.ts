// src/controllers/activity.controller.ts

import { Request, Response } from "express";
import {
  publishActivity,
  getPendingActivities,
  auditActivityApplication,
  getAllActivities,
} from "../services/activity.service";
import { ActivityStatus } from "@prisma/client";

export const createActivityApplication = async (
  req: Request,
  res: Response
) => {
  try {
    const { clubId, name, description, coverImage, date, endAt, location } =
      req.body;

    if (!clubId || !name || !date || !endAt) {
      return res.status(400).json({ code: 400, message: "请填写必要信息" });
    }

    const activity = await publishActivity({
      clubId: parseInt(clubId, 10),
      name,
      description,
      coverImage,
      date: new Date(date),
      endAt: new Date(endAt),
      location,
    });

    res.status(201).json({
      code: 201,
      message: "活动发布申请已提交，请等待审核",
      data: activity,
    });
  } catch (error: any) {
    res.status(400).json({ code: 400, message: error.message });
  }
};

export const uploadActivityCover = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ code: 400, message: "请选择图片" });
    }
    const url = `/uploads/activities/${req.file.filename}`;
    res.status(200).json({ code: 200, message: "上传成功", data: { url } });
  } catch (error: any) {
    res.status(500).json({ code: 500, message: error.message });
  }
};

export const getAuditList = async (req: Request, res: Response) => {
  try {
    const activities = await getPendingActivities();
    res.status(200).json({ code: 200, data: activities });
  } catch (error: any) {
    res.status(500).json({ code: 500, message: error.message });
  }
};

export const auditActivity = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, reason } = req.body;

    if (!status || !Object.values(ActivityStatus).includes(status)) {
      return res.status(400).json({ code: 400, message: "状态无效" });
    }

    await auditActivityApplication(parseInt(id, 10), status, reason);
    res.status(200).json({ code: 200, message: "处理成功" });
  } catch (error: any) {
    res.status(400).json({ code: 400, message: error.message });
  }
};

export const getActivityList = async (req: Request, res: Response) => {
  try {
    const activities = await getAllActivities();
    res.status(200).json({ code: 200, data: activities });
  } catch (error: any) {
    res.status(500).json({ code: 500, message: error.message });
  }
};
