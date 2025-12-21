import { Expense } from "../models/Expense.js";

export const getMonthlySummary = async (req, res) => {
    try {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

        const expenses = await Expense.find({
            user_id: req.user.id,
            date: { $gte: startOfMonth, $lte: endOfMonth },
        });

        const totalAmount = expenses.reduce((sum, e) => sum + e.amount, 0);
        const count = expenses.length;

        const categoryBreakdown = {};
        for (const e of expenses) {
            categoryBreakdown[e.category] =
                (categoryBreakdown[e.category] || 0) + e.amount;
        }

        res.json({
            totalAmount,
            count,
            categoryBreakdown,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};
