import { useEffect, useState } from "react";
import api from "../api/axiosClient";
import AnimatedWrapper from "../components/AnimatedWrapper";
import StatCard from "../components/StatCard";

export default function BudgetPage() {
    const [budget, setBudget] = useState(null);
    const [summary, setSummary] = useState(null);
    const [amount, setAmount] = useState("");
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");

    const fetchData = async () => {
        try {
            const [budgetRes, summaryRes] = await Promise.all([
                api.get("/budget/current"),
                api.get("/summary/monthly"),
            ]);
            setBudget(budgetRes.data);
            setSummary(summaryRes.data);
            setAmount(budgetRes.data?.amount || "");
        } catch (err) {
            console.error("Error fetching budget/summary", err);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage("");
        try {
            const now = new Date();
            const month = `${now.getFullYear()}-${String(
                now.getMonth() + 1
            ).padStart(2, "0")}`;

            const res = await api.post("/budget", {
                month,
                amount: Number(amount),
            });
            setBudget(res.data);
            setMessage("Budget saved successfully!");
        } catch (err) {
            console.error("Error saving budget", err);
            setMessage("Failed to save budget.");
        } finally {
            setSaving(false);
        }
    };

    const totalSpent = summary?.totalAmount || 0;
    const budgetAmount = budget?.amount || 0;
    const remaining = budgetAmount - totalSpent;
    const exceeded = remaining < 0;

    const progress =
        budgetAmount > 0
            ? Math.min(100, (totalSpent / budgetAmount) * 100)
            : 0;

    return (
        <AnimatedWrapper>
            <main className="max-w-6xl mx-auto px-4 py-6 space-y-4">
                <h1 className="text-xl sm:text-2xl font-semibold text-slate-900">
                    Budget
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <StatCard
                        title="Budget Amount"
                        value={`₹${budgetAmount.toFixed(2)}`}
                        accent="green"
                        subtitle="Your set limit for this month"
                    />
                    <StatCard
                        title="Spent This Month"
                        value={`₹${totalSpent.toFixed(2)}`}
                        accent="blue"
                        subtitle="Total expenses this month"
                    />
                    <StatCard
                        title={exceeded ? "Exceeded By" : "Remaining"}
                        value={
                            budgetAmount
                                ? `₹${Math.abs(remaining).toFixed(2)}`
                                : "Set a budget"
                        }
                        accent={exceeded ? "orange" : "purple"}
                        subtitle={
                            exceeded
                                ? "You have overspent your budget."
                                : "Amount left under your budget."
                        }
                    />
                </div>

                <div className="bg-white rounded-2xl shadow-soft border border-slate-100 p-4 sm:p-5">
                    <h2 className="text-sm font-semibold text-slate-800 mb-3">
                        Monthly Budget
                    </h2>

                    {/* Progress bar */}
                    <div className="mb-4">
                        <div className="flex justify-between text-xs text-slate-500 mb-1">
                            <span>Usage</span>
                            <span>
                                {budgetAmount
                                    ? `${progress.toFixed(0)}% of budget used`
                                    : "No budget set"}
                            </span>
                        </div>
                        <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
                            <div
                                className={`h-full rounded-full transition-all ${exceeded ? "bg-rose-500" : "bg-emerald-500"
                                    }`}
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>

                    {/* Form */}
                    <form
                        onSubmit={handleSave}
                        className="flex flex-col sm:flex-row gap-3 items-start sm:items-end"
                    >
                        <div className="flex flex-col gap-1">
                            <label className="text-xs text-slate-500">
                                Budget amount for current month
                            </label>
                            <input
                                type="number"
                                min="0"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="px-3 py-2 rounded-xl border text-xs focus:outline-none focus:ring-2 focus:ring-blue-400"
                                placeholder="Enter amount in ₹"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={saving}
                            className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-medium hover:bg-slate-800 transition disabled:opacity-60"
                        >
                            {saving ? "Saving..." : "Save Budget"}
                        </button>

                        {message && (
                            <p className="text-xs text-slate-500 sm:ml-2">{message}</p>
                        )}
                    </form>
                </div>
            </main>
        </AnimatedWrapper>
    );
}
