import { Expense } from "../models/Expense.js";

export const createExpense = async (req, res) => {
    try {
        const { title, amount, category, date, notes } = req.body;

        const expense = await Expense.create({
            user_id: req.user.id,
            title,
            amount,
            category,
            date: date || new Date(),
            notes,
        });

        res.status(201).json(expense);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

export const getExpenses = async (req, res) => {
    try {
        const { category, from, to } = req.query;

        const filter = { user_id: req.user.id };

        if (category) filter.category = category;
        if (from || to) {
            filter.date = {};
            if (from) filter.date.$gte = new Date(from);
            if (to) filter.date.$lte = new Date(to);
        }

        const expenses = await Expense.find(filter).sort({ date: -1 });
        res.json(expenses);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

export const updateExpense = async (req, res) => {
    try {
        const { id } = req.params;
        const expense = await Expense.findOneAndUpdate(
            { _id: id, user_id: req.user.id },
            req.body,
            { new: true }
        );

        if (!expense) return res.status(404).json({ message: "Not found" });

        res.json(expense);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

export const deleteExpense = async (req, res) => {
    try {
        const { id } = req.params;
        const expense = await Expense.findOneAndDelete({
            _id: id,
            user_id: req.user.id,
        });

        if (!expense) return res.status(404).json({ message: "Not found" });

        res.json({ message: "Expense deleted" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};
