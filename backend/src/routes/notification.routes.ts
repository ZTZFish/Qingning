
import express from "express";
import { getCounts } from "../controllers/notification.controller";
import { authenticateJWT } from "../middlewares/auth.middleware";

const router = express.Router();

router.get("/counts", authenticateJWT, getCounts);

export default router;
