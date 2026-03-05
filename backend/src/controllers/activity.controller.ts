// src/controllers/activity.controller.ts

import { Request, Response } from "express";
import {
  publishActivity,
  saveActivityDraft,
  submitActivityApplication,
  getPendingActivities,
  auditActivityApplication,
  getAllActivities,
  cancelActivity,
  adminDeleteActivity,
  getActivityDetail,
  updateActivityDraft,
  enrollActivity,
  getActivityEnrollments,
  auditEnrollment,
} from "../services/activity.service";
import { ActivityStatus, ParticipationStatus } from "@prisma/client";

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

export const createActivityDraft = async (req: Request, res: Response) => {
  try {
    const operatorId = (req as any).user.id;
    const { clubId, name, description, coverImage, date, endAt, location } =
      req.body;
    const draft = await saveActivityDraft(operatorId, {
      clubId: clubId ? parseInt(clubId, 10) : undefined,
      name,
      description,
      coverImage,
      date: date ? new Date(date) : undefined,
      endAt: endAt ? new Date(endAt) : undefined,
      location,
    });
    res.status(201).json({
      code: 201,
      message: "草稿已保存",
      data: draft,
    });
  } catch (error: any) {
    res.status(400).json({ code: 400, message: error.message });
  }
};

export const submitActivity = async (req: Request, res: Response) => {
  try {
    const operatorId = (req as any).user.id;
    const { id } = req.params;
    const { name, description, coverImage, date, endAt, location } = req.body;
    const updated = await submitActivityApplication(
      operatorId,
      parseInt(id, 10),
      {
        name,
        description,
        coverImage,
        date: new Date(date),
        endAt: new Date(endAt),
        location,
      }
    );
    res.status(200).json({ code: 200, message: "已提交审核", data: updated });
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

export const cancelActivityController = async (req: Request, res: Response) => {
  try {
    const operatorId = (req as any).user.id;
    const { id } = req.params;
    const updated = await cancelActivity(operatorId, parseInt(id, 10));
    res.status(200).json({ code: 200, message: "活动已取消", data: updated });
  } catch (error: any) {
    res.status(400).json({ code: 400, message: error.message });
  }
};

export const deleteActivityController = async (req: Request, res: Response) => {
  try {
    const operatorId = (req as any).user.id;
    const { id } = req.params;
    await adminDeleteActivity(operatorId, parseInt(id, 10));
    res.status(200).json({ code: 200, message: "活动已删除" });
  } catch (error: any) {
    res.status(400).json({ code: 400, message: error.message });
  }
};

export const getActivityDetailController = async (
  req: Request,
  res: Response
) => {
  try {
    const operatorId = (req as any).user.id;
    const { id } = req.params;
    const activity = await getActivityDetail(operatorId, parseInt(id, 10));
    res.status(200).json({ code: 200, message: "获取成功", data: activity });
  } catch (error: any) {
    res.status(400).json({ code: 400, message: error.message });
  }
};

export const updateActivityDraftController = async (
  req: Request,
  res: Response
) => {
  try {
    const operatorId = (req as any).user.id;
    const { id } = req.params;
    const { name, description, coverImage, date, endAt, location } = req.body;
    const updated = await updateActivityDraft(operatorId, parseInt(id, 10), {
      name,
      description,
      coverImage,
      date: date ? new Date(date) : undefined,
      endAt: endAt ? new Date(endAt) : undefined,
      location,
    });
    res.status(200).json({ code: 200, message: "保存成功", data: updated });
  } catch (error: any) {
    res.status(400).json({ code: 400, message: error.message });
  }
};

export const enrollActivityController = async (req: Request, res: Response) => {
  try {
    const operatorId = (req as any).user.id;
    const { id } = req.params;
    const { notes } = req.body;
    const result = await enrollActivity(operatorId, parseInt(id, 10), notes);
    res
      .status(201)
      .json({ code: 201, message: "报名申请已提交", data: result });
  } catch (error: any) {
    res.status(400).json({ code: 400, message: error.message });
  }
};

export const getEnrollmentListController = async (
  req: Request,
  res: Response
) => {
  try {
    const operatorId = (req as any).user.id;
    const { id } = req.params;
    const page = parseInt(req.query.page as string, 10) || 1;
    const pageSize = parseInt(req.query.pageSize as string, 10) || 10;

    // 显式转换 query 参数
    const publicQuery = req.query.public as string;
    const statusQuery = req.query.status as string;

    // 如果是 public 视图，强制 status 为 APPROVED，否则使用 query 中的 status
    const publicView = publicQuery === "true";

    // 再次强制逻辑：如果是 publicView，不管 statusQuery 是什么，都应该是 APPROVED
    // 如果不是 publicView，则使用 statusQuery 转换
    const status = publicView
      ? ParticipationStatus.APPROVED
      : (statusQuery as ParticipationStatus | undefined);

    const result = await getActivityEnrollments(
      operatorId,
      parseInt(id, 10),
      page,
      pageSize,
      status,
      publicView
    );
    res.status(200).json({ code: 200, data: result });
  } catch (error: any) {
    res.status(400).json({ code: 400, message: error.message });
  }
};

export const auditEnrollmentController = async (
  req: Request,
  res: Response
) => {
  try {
    const operatorId = (req as any).user.id;
    const { id, userId } = req.params;
    const { status } = req.body;

    const result = await auditEnrollment(
      operatorId,
      parseInt(id, 10),
      parseInt(userId, 10),
      status
    );
    res.status(200).json({ code: 200, message: "审核操作成功", data: result });
  } catch (error: any) {
    res.status(400).json({ code: 400, message: error.message });
  }
};

export const getAuditList = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string, 10) || 1;
    const pageSize = parseInt(req.query.pageSize as string, 10) || 10;
    const result = await getPendingActivities(page, pageSize);
    res.status(200).json({ code: 200, data: result });
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

export const getActivities = async (req: Request, res: Response) => {
  try {
    const { page = 1, pageSize = 10, search, clubId } = req.query;
    const user = (req as any).user;

    // 如果是社团负责人，只获取自己负责社团的活动
    // 如果是管理员，获取所有活动
    // 如果是普通用户，逻辑可能不同（比如只看公开的），这里暂时假设普通用户只能看已发布的（需在service层处理状态过滤，或者这里简化为全部）
    // 但根据需求，这里主要服务于管理后台列表。

    let leaderId: number | undefined;
    let statuses: ActivityStatus[] | undefined;
    if (user && user.role === "LEADER") {
      leaderId = user.id;
    }
    if (user && user.role === "ADMIN") {
      statuses = [
        ActivityStatus.APPROVED,
        ActivityStatus.REJECTED,
        ActivityStatus.ONGOING,
        ActivityStatus.FINISHED,
        ActivityStatus.CANCELED,
      ];
    }

    const result = await getAllActivities(
      parseInt(page as string, 10),
      parseInt(pageSize as string, 10),
      search as string,
      clubId ? parseInt(clubId as string, 10) : undefined,
      leaderId,
      statuses
    );
    res.status(200).json({
      code: 200,
      message: "获取成功",
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({ code: 400, message: error.message });
  }
};
