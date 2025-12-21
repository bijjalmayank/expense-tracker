import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import expenseRoutes from "./routes/expense.routes.js";
import budgetRoutes from "./routes/budget.routes.js";
import summaryRoutes from "./routes/summary.routes.js";

dotenv.config();

const app = express();

// Middlewares
app.use(express.json());
const clientUrl = (process.env.CLIENT_URL || "").replace(/\/$/, "");
const allowedOrigins = clientUrl ? [clientUrl] : [];

if (!clientUrl) {
    console.warn(
        "Warning: CLIENT_URL is not set. CORS allowlist is empty — browser requests may be blocked."
    );
}

app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin) return callback(null, true);
            const cleanedOrigin = origin.replace(/\/$/, "");
            if (allowedOrigins.includes(cleanedOrigin)) return callback(null, true);
            callback(new Error("Not allowed by CORS"));
        },
        credentials: true,
    })
);

// Routes
app.use("/auth", authRoutes);
app.use("/expenses", expenseRoutes);
app.use("/budget", budgetRoutes);
app.use("/summary", summaryRoutes);

app.get("/", (req, res) => {
    res.send("Expense Tracker API is running");
});

// Start server
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
    app.listen(PORT, () => console.log(`🚀 Server listening on port ${PORT}`));
});
