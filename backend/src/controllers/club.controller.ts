// src/controllers/club.controller.ts

import { Request, Response } from "express";
import {
  applyForClub,
  getPendingClubs,
  auditClubApplication,
  getAllClubs,
  getUserLedClubs,
  getUserJoinedClubs,
  transferClubLeadership,
  getClubInfo,
  joinClub,
  leaveClub,
  getMembers,
  getPendingApplications,
  auditMembership,
  updateClubInfo,
} from "../services/club.service";
import { Status, MembershipStatus } from "@prisma/client";

// 更新社团信息
export const updateClub = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user.id;
    const { name, description, coverImage } = req.body;

    const updatedClub = await updateClubInfo(userId, parseInt(id, 10), {
      name,
      description,
      coverImage,
    });

    res.status(200).json({
      code: 200,
      message: "更新成功",
      data: updatedClub,
    });
  } catch (error: any) {
    res.status(400).json({ code: 400, message: error.message });
  }
};

// 获取社团详情
export const getClubDetail = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user.id;
    const result = await getClubInfo(parseInt(id, 10), userId);
    res.status(200).json({
      code: 200,
      message: "获取成功",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({ code: 500, message: error.message });
  }
};

// 申请加入社团
export const join = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user.id;
    await joinClub(userId, parseInt(id, 10));
    res.status(200).json({
      code: 200,
      message: "申请已提交",
    });
  } catch (error: any) {
    res.status(400).json({ code: 400, message: error.message });
  }
};

// 退出社团
export const leave = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user.id;
    await leaveClub(userId, parseInt(id, 10));
    res.status(200).json({
      code: 200,
      message: "已退出社团",
    });
  } catch (error: any) {
    res.status(400).json({ code: 400, message: error.message });
  }
};

// 获取社团成员列表
export const getClubMembers = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const page = parseInt(req.query.page as string, 10) || 1;
    const pageSize = parseInt(req.query.pageSize as string, 10) || 10;
    const result = await getMembers(parseInt(id, 10), page, pageSize);
    res.status(200).json({
      code: 200,
      message: "获取成功",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({ code: 500, message: error.message });
  }
};

// 获取入社申请列表
export const getApplications = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user.id;
    const page = parseInt(req.query.page as string, 10) || 1;
    const pageSize = parseInt(req.query.pageSize as string, 10) || 10;

    const result = await getPendingApplications(
      parseInt(id, 10),
      userId,
      page,
      pageSize
    );
    res.status(200).json({
      code: 200,
      message: "获取成功",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({ code: 500, message: error.message });
  }
};

// 审批入社申请
export const auditApplication = async (req: Request, res: Response) => {
  try {
    const { id, memberId } = req.params;
    const { status } = req.body;
    const userId = (req as any).user.id;

    if (!status) {
      return res.status(400).json({ code: 400, message: "请指定审批状态" });
    }

    await auditMembership(
      parseInt(id, 10),
      userId,
      parseInt(memberId, 10),
      status as MembershipStatus
    );

    res.status(200).json({
      code: 200,
      message: status === "APPROVED" ? "已批准加入" : "已拒绝申请",
    });
  } catch (error: any) {
    res.status(400).json({ code: 400, message: error.message });
  }
};

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

// 获取用户管理的社团
export const getLedClubs = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const clubs = await getUserLedClubs(parseInt(userId, 10));
    res.status(200).json({
      code: 200,
      message: "获取成功",
      data: clubs,
    });
  } catch (error: any) {
    res.status(500).json({ code: 500, message: error.message });
  }
};

// 获取用户加入的社团
export const getJoinedClubs = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const page = parseInt(req.query.page as string, 10) || 1;
    const pageSize = parseInt(req.query.pageSize as string, 10) || 10;

    const result = await getUserJoinedClubs(
      parseInt(userId, 10),
      page,
      pageSize
    );
    res.status(200).json({
      code: 200,
      message: "获取成功",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({ code: 500, message: error.message });
  }
};

// 转让社团负责人
export const transferLeader = async (req: Request, res: Response) => {
  try {
    const { clubId } = req.params;
    const { newLeaderId } = req.body;

    if (!newLeaderId) {
      return res.status(400).json({ code: 400, message: "请指定新负责人" });
    }

    await transferClubLeadership(
      parseInt(clubId, 10),
      parseInt(newLeaderId, 10)
    );

    res.status(200).json({
      code: 200,
      message: "转让成功",
    });
  } catch (error: any) {
    res.status(400).json({ code: 400, message: error.message });
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
