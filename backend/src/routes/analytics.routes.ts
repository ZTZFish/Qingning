import express from "express";
import { getOverview } from "../controllers/analytics.controller";
import { authenticateJWT, checkRole } from "../middlewares/auth.middleware";
import { Role } from "@prisma/client/index.js";

const router = express.Router();

router.get("/overview", authenticateJWT, checkRole([Role.ADMIN]), getOverview);

export default router;

