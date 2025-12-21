import { Router } from "express";
import { setBudget, getCurrentBudget } from "../controllers/budget.controller.js";
import { auth } from "../middleware/auth.js";

const router = Router();

router.post("/", auth, setBudget);           // POST /budget
router.get("/current", auth, getCurrentBudget); // GET /budget/current

export default router;
