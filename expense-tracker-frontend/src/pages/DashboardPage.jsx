import { useEffect, useState } from "react";
import api from "../api/axiosClient";
import AnimatedWrapper from "../components/AnimatedWrapper";
import { useAuth } from "../context/AuthContext";
import StatCard from "../components/StatCard";
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

const CATEGORY_COLORS = {
    food: "#fb923c",
    travel: "#3b82f6",
    shopping: "#a855f7",
    bills: "#f97373",
    other: "#6b7280",
};

export default function DashboardPage() {
    const { user } = useAuth();
    const [summary, setSummary] = useState(null);
    const [budget, setBudget] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const [summaryRes, budgetRes] = await Promise.all([
                    api.get("/summary/monthly"),
                    api.get("/budget/current"),
                ]);
                setSummary(summaryRes.data);
                setBudget(budgetRes.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    if (loading) {
        return (
            <div className="pt-20 flex justify-center text-slate-500 text-sm">
                Loading dashboard...
            </div>
        );
    }

    const total = summary?.totalAmount || 0;
    const count = summary?.count || 0;
    const budgetAmount = budget?.amount || 0;
    const remaining = budgetAmount - total;
    const exceeded = remaining < 0;

    const pieData = summary
        ? Object.entries(summary.categoryBreakdown || {}).map(
            ([name, value]) => ({ name, value })
        )
        : [];

    return (
        <AnimatedWrapper>
            <main className="max-w-6xl mx-auto px-4 py-6">
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-xl sm:text-2xl font-semibold text-slate-900">
                        Overview
                    </h1>
                    <div className="text-sm text-slate-700">Hi! {user?.name || "User"}</div>
                </div>

                {/* Stat cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <StatCard
                        title="Total Spent (This Month)"
                        value={`₹${total.toFixed(2)}`}
                        accent="blue"
                        subtitle="Sum of all your expenses this month"
                    />
                    <StatCard
                        title="Total Expenses"
                        value={count}
                        accent="purple"
                        subtitle="Number of expense entries this month"
                    />
                    <StatCard
                        title="Budget Set"
                        value={`₹${budgetAmount.toFixed(2)}`}
                        accent="green"
                        subtitle={budgetAmount ? "Your monthly limit" : "No budget set yet"}
                    />
                    <StatCard
                        title="Remaining"
                        value={budgetAmount ? `₹${remaining.toFixed(2)}` : "Set a budget to see"}
                        accent={exceeded ? "orange" : "green"}
                        subtitle={
                            exceeded
                                ? "You have exceeded your budget"
                                : "Amount left to spend under budget"
                        }
                        progress={budgetAmount ? Math.max(0, remaining) / budgetAmount : null}
                        progressLabel={budgetAmount ? `₹${Math.max(0, remaining).toFixed(2)} / ₹${budgetAmount.toFixed(2)}` : null}
                    />
                </div>

                {/* Bottom section: pie chart + legend */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white rounded-2xl shadow-soft p-4 sm:p-5 border border-slate-100">
                        <h2 className="text-sm font-semibold text-slate-800 mb-3">
                            Category-wise Breakdown
                        </h2>
                        {pieData.length === 0 ? (
                            <p className="text-xs text-slate-500">
                                No data yet. Add some expenses to see breakdown.
                            </p>
                        ) : (
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={pieData}
                                            dataKey="value"
                                            nameKey="name"
                                            innerRadius={50}
                                            outerRadius={80}
                                            paddingAngle={2}
                                        >
                                            {pieData.map((entry, index) => (
                                                <Cell
                                                    key={`cell-${index}`}
                                                    fill={
                                                        CATEGORY_COLORS[entry.name] ||
                                                        "#64748b"
                                                    }
                                                />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        )}
                    </div>

                    <div className="bg-white rounded-2xl shadow-soft p-4 sm:p-5 border border-slate-100">
                        <h2 className="text-sm font-semibold text-slate-800 mb-3">
                            Category Details
                        </h2>
                        <div className="space-y-2">
                            {pieData.length === 0 && (
                                <p className="text-xs text-slate-500">
                                    Category list appears once you add expenses.
                                </p>
                            )}
                            {pieData.map((item) => (
                                <div
                                    key={item.name}
                                    className="flex items-center justify-between text-sm"
                                >
                                    <div className="flex items-center gap-2">
                                        <span
                                            className="w-2.5 h-2.5 rounded-full"
                                            style={{
                                                backgroundColor:
                                                    CATEGORY_COLORS[item.name] || "#64748b",
                                            }}
                                        />
                                        <span className="capitalize text-slate-700">
                                            {item.name}
                                        </span>
                                    </div>
                                    <span className="font-medium text-slate-900">
                                        ₹{item.value.toFixed(2)}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <div className="mt-4 p-3 rounded-xl bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 border border-slate-100 text-xs text-slate-600">
                            Pro tip: Try categorizing your expenses accurately to get a
                            better insight into your spending habits.
                        </div>
                    </div>
                </div>
            </main>
        </AnimatedWrapper>
    );
}
