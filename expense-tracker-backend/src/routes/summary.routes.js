import { Router } from "express";
import { getMonthlySummary } from "../controllers/summary.controller.js";
import { auth } from "../middleware/auth.js";

const router = Router();

router.get("/monthly", auth, getMonthlySummary); // GET /summary/monthly

export default router;
