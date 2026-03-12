import request from "@/utils/request";
import type { Activity, Club } from "@/types";

export interface RecommendationsResult {
  tags: string[];
  clubs: Club[];
  activities: Activity[];
}

export const getRecommendations = (params?: { clubs?: number; activities?: number }) => {
  return request.get<RecommendationsResult>("/recommendations", { params });
};

