import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        title: { type: String, required: true },
        amount: { type: Number, required: true },
        category: {
            type: String,
            enum: ["food", "travel", "shopping", "bills", "other"],
            default: "other",
        },
        date: { type: Date, default: Date.now },
        notes: { type: String },
    },
    { timestamps: true }
);

export const Expense = mongoose.model("Expense", expenseSchema);
