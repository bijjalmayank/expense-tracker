import { Budget } from "../models/Budget.js";

export const setBudget = async (req, res) => {
    try {
        const { month, amount } = req.body;

        const budget = await Budget.findOneAndUpdate(
            { user_id: req.user.id, month },
            { amount },
            { upsert: true, new: true }
        );

        res.json(budget);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

export const getCurrentBudget = async (req, res) => {
    try {
        const now = new Date();
        const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
            2,
            "0"
        )}`;

        const budget = await Budget.findOne({
            user_id: req.user.id,
            month,
        });

        res.json(budget || { month, amount: 0 });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};
