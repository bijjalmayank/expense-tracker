import mongoose from "mongoose";

const budgetSchema = new mongoose.Schema(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        month: {
            type: String, // "YYYY-MM"
            required: true,
        },
        amount: {
            type: Number,
            required: true,
        },
    },
    { timestamps: true }
);

export const Budget = mongoose.model("Budget", budgetSchema);
