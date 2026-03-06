
import request from "@/utils/request";

export interface Announcement {
  id: number;
  clubId?: number;
  authorId?: number;
  title: string;
  content: string;
  pinned: boolean;
  createdAt: string;
  updatedAt: string;
  author?: {
    id: number;
    username: string;
    realName?: string;
  };
}

export function getAnnouncements(params?: {
  page: number;
  pageSize: number;
  search?: string;
  clubId?: number;
}) {
  return request.get<{ list: Announcement[]; total: number }>(
    "/announcements",
    {
      params,
    }
  );
}

export function getAnnouncementDetail(id: number) {
  return request.get<Announcement>(`/announcements/${id}`);
}

export function createAnnouncement(data: {
  title: string;
  content: string;
  pinned?: boolean;
  clubId?: number;
}) {
  return request.post<Announcement>("/announcements", data);
}

export function updateAnnouncement(
  id: number,
  data: {
    title?: string;
    content?: string;
    pinned?: boolean;
  }
) {
  return request.put<Announcement>(`/announcements/${id}`, data);
}

export function deleteAnnouncement(id: number) {
  return request.delete(`/announcements/${id}`);
}
