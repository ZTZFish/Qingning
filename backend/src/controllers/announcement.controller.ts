import { Request, Response } from "express";
import {
  publishAnnouncement,
  editAnnouncement,
  removeAnnouncement,
  getAnnouncementList,
  getAnnouncementDetail,
  getPersonalMessageList,
  markMyMessageRead,
} from "../services/announcement.service";
import { Role } from "@prisma/client";

export const create = async (req: Request, res: Response) => {
  try {
    const authorId = (req as any).user.id;
    const { title, content, pinned } = req.body;

    if (!title || !content) {
      return res.status(400).json({ code: 400, message: "标题和内容不能为空" });
    }

    const result = await publishAnnouncement(authorId, {
      title,
      content,
      pinned,
    });

    res.status(201).json({
      code: 201,
      message: "发布成功",
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({ code: 400, message: error.message });
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const operatorId = (req as any).user.id;
    const { id } = req.params;
    const { title, content, pinned } = req.body;

    const result = await editAnnouncement(operatorId, parseInt(id, 10), {
      title,
      content,
      pinned,
    });

    res.status(200).json({
      code: 200,
      message: "更新成功",
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({ code: 400, message: error.message });
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    const operatorId = (req as any).user.id;
    const { id } = req.params;

    await removeAnnouncement(operatorId, parseInt(id, 10));

    res.status(200).json({
      code: 200,
      message: "删除成功",
    });
  } catch (error: any) {
    res.status(400).json({ code: 400, message: error.message });
  }
};

export const getList = async (req: Request, res: Response) => {
  try {
    const operatorId = (req as any).user.id;
    const page = parseInt(req.query.page as string, 10) || 1;
    const pageSize = parseInt(req.query.pageSize as string, 10) || 10;
    const search = (req.query.search as string) || undefined;
    const type = (req.query.type as string) || "public";

    const result =
      type === "messages"
        ? await getPersonalMessageList(operatorId, page, pageSize, search)
        : await getAnnouncementList(page, pageSize, search);

    res.status(200).json({
      code: 200,
      message: "获取成功",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({ code: 500, message: error.message });
  }
};

export const getDetail = async (req: Request, res: Response) => {
  try {
    const operatorId = (req as any).user.id;
    const operatorRole = (req as any).user.role as Role;
    const { id } = req.params;
    const result = await getAnnouncementDetail(
      operatorId,
      operatorRole,
      parseInt(id, 10)
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

export const markRead = async (req: Request, res: Response) => {
  try {
    const operatorId = (req as any).user.id;
    const { id } = req.params;
    await markMyMessageRead(operatorId, parseInt(id, 10));
    res.status(200).json({ code: 200, message: "已读成功" });
  } catch (error: any) {
    res.status(400).json({ code: 400, message: error.message });
  }
};
