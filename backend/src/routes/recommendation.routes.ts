import express from "express";
import { authenticateJWT } from "../middlewares/auth.middleware";
import { getRecommendations } from "../controllers/recommendation.controller";

const router = express.Router();

router.get("/", authenticateJWT, getRecommendations);

export default router;

