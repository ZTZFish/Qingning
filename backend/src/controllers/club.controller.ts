// src/controllers/club.controller.ts

import { Request, Response } from "express";
import {
  applyForClub,
  getPendingClubs,
  auditClubApplication,
  getAllClubs,
} from "../services/club.service";
import { Status } from "@prisma/client";

// 用户提交社团申请
export const createClubApplication = async (req: Request, res: Response) => {
  try {
    const { name, type, description, coverImage, materials } = req.body;
    const userId = (req as any).user.id;

    if (!name || !type || !description) {
      return res.status(400).json({ code: 400, message: "请填写完整信息" });
    }

    const club = await applyForClub({
      name,
      type,
      description,
      coverImage,
      materials,
      leaderId: userId,
    });

    res.status(201).json({
      code: 201,
      message: "申请提交成功，请等待审核",
      data: club,
    });
  } catch (error: any) {
    res.status(400).json({ code: 400, message: error.message });
  }
};

// 上传社团封面
export const uploadClubCover = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ code: 400, message: "请选择要上传的图片" });
    }

    const coverUrl = `/uploads/clubs/${req.file.filename}`;

    res.status(200).json({
      code: 200,
      message: "封面上传成功",
      data: { url: coverUrl },
    });
  } catch (error: any) {
    res.status(500).json({ code: 500, message: error.message });
  }
};

// 上传社团手续照片
export const uploadClubMaterials = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ code: 400, message: "请选择要上传的图片" });
    }

    const materialsUrl = `/uploads/materials/${req.file.filename}`;

    res.status(200).json({
      code: 200,
      message: "手续照片上传成功",
      data: { url: materialsUrl },
    });
  } catch (error: any) {
    res.status(500).json({ code: 500, message: error.message });
  }
};

// 管理员获取待审批列表
export const getAuditList = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string, 10) || 1;
    const pageSize = parseInt(req.query.pageSize as string, 10) || 10;
    const result = await getPendingClubs(page, pageSize);
    res.status(200).json({
      code: 200,
      message: "获取成功",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({ code: 500, message: error.message });
  }
};

// 管理员审批社团
export const auditClub = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, reason } = req.body;

    if (!status || !Object.values(Status).includes(status)) {
      return res.status(400).json({ code: 400, message: "审批状态无效" });
    }

    await auditClubApplication(parseInt(id, 10), status, reason);

    res.status(200).json({
      code: 200,
      message: status === Status.APPROVED ? "已批准创建" : "已拒绝申请",
    });
  } catch (error: any) {
    res.status(400).json({ code: 400, message: error.message });
  }
};

// 获取所有社团列表（用于管理页面）
export const getClubList = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string, 10) || 1;
    const pageSize = parseInt(req.query.pageSize as string, 10) || 10;
    const search = (req.query.search as string) || undefined;
    const result = await getAllClubs(page, pageSize, search);
    res.status(200).json({
      code: 200,
      message: "获取成功",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({ code: 500, message: error.message });
  }
};
