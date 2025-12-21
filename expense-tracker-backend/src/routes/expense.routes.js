import { Router } from "express";
import {
    createExpense,
    getExpenses,
    updateExpense,
    deleteExpense,
} from "../controllers/expense.controller.js";
import { auth } from "../middleware/auth.js";

const router = Router();

router.post("/", auth, createExpense);
router.get("/", auth, getExpenses);
router.put("/:id", auth, updateExpense);
router.delete("/:id", auth, deleteExpense);

export default router;
