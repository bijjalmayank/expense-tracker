import { useEffect, useState } from "react";
import api from "../api/axiosClient";
import AnimatedWrapper from "../components/AnimatedWrapper";
import ExpenseTable from "../components/ExpenseTable";
import ExpenseFormModal from "../components/ExpenseFormModal";

const categories = ["all", "food", "travel", "shopping", "bills", "other"];

export default function ExpensesPage() {
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [budget, setBudget] = useState(null);
    const [showBudgetWarning, setShowBudgetWarning] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingExpense, setEditingExpense] = useState(null);

    const fetchExpenses = async () => {
        setLoading(true);
        try {
            const params = {};
            if (categoryFilter !== "all") params.category = categoryFilter;
            if (fromDate) params.from = fromDate;
            if (toDate) params.to = toDate;

            const res = await api.get("/expenses", { params });
            setExpenses(res.data);
        } catch (err) {
            console.error("Error fetching expenses", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchExpenses();
        api.get("/budget/current")
            .then((res) => setBudget(res.data))
            .catch(() => setBudget(null));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const openAddModal = () => {
        setEditingExpense(null);
        if (budget && budget.amount > 0) {
            const total = expenses.reduce((sum, e) => sum + e.amount, 0);
            setShowBudgetWarning(total >= budget.amount);
        } else {
            setShowBudgetWarning(false);
        }
        setModalOpen(true);
    };

    const openEditModal = (expense) => {
        setEditingExpense(expense);
        setModalOpen(true);
    };

    const handleDelete = (id) => setDeleteId(id);

    const confirmDelete = async () => {
        if (!deleteId) return;
        try {
            await api.delete(`/expenses/${deleteId}`);
            setExpenses((prev) => prev.filter((e) => e._id !== deleteId));
        } catch (err) {
            console.error("Error deleting expense", err);
        }
        setDeleteId(null);
    };

    const handleSave = async (data) => {
        try {
            if (editingExpense) {
                const res = await api.put(`/expenses/${editingExpense._id}`, data);
                setExpenses((prev) =>
                    prev.map((e) => (e._id === editingExpense._id ? res.data : e))
                );
            } else {
                const res = await api.post("/expenses", data);
                setExpenses((prev) => [res.data, ...prev]);
            }
            setModalOpen(false);
        } catch (err) {
            console.error("Error saving expense", err);
        }
    };

    const applyFilters = async () => {
        await fetchExpenses();
    };

    const clearFilters = () => {
        setCategoryFilter("all");
        setFromDate("");
        setToDate("");
        fetchExpenses();
    };

    return (
        <AnimatedWrapper>
            <main className="max-w-6xl mx-auto px-4 py-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                    <h1 className="text-xl sm:text-2xl font-semibold text-slate-900">
                        Expenses
                    </h1>
                    <button
                        onClick={openAddModal}
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white text-sm px-4 py-2 rounded-xl shadow-soft hover:opacity-90 transition"
                    >
                        + Add Expense
                    </button>
                </div>

                {showBudgetWarning && (
                    <div className="mb-2 px-4 py-2 rounded-xl bg-orange-50 border border-orange-200 text-orange-700 text-xs font-medium">
                        Warning: You have already exceeded your budget limit. You can still add expenses.
                    </div>
                )}

                {/* Filters */}
                <div className="mb-4 bg-white rounded-2xl shadow-soft border border-slate-100 p-3 sm:p-4 flex flex-col sm:flex-row gap-3 items-start sm:items-end">
                    <div className="flex flex-col gap-1">
                        <label className="text-xs text-slate-500">Category</label>
                        <select
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                            className="px-3 py-2 rounded-xl border text-xs focus:outline-none focus:ring-2 focus:ring-blue-400"
                        >
                            {categories.map((c) => (
                                <option key={c} value={c}>
                                    {c === "all" ? "All" : c.charAt(0).toUpperCase() + c.slice(1)}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-xs text-slate-500">From</label>
                        <input
                            type="date"
                            value={fromDate}
                            onChange={(e) => setFromDate(e.target.value)}
                            className="px-3 py-2 rounded-xl border text-xs focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-xs text-slate-500">To</label>
                        <input
                            type="date"
                            value={toDate}
                            onChange={(e) => setToDate(e.target.value)}
                            className="px-3 py-2 rounded-xl border text-xs focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>

                    <div className="flex gap-2 sm:ml-auto">
                        <button
                            onClick={applyFilters}
                            className="px-3 py-2 rounded-xl text-xs bg-slate-900 text-white hover:bg-slate-800"
                        >
                            Apply
                        </button>
                        <button
                            onClick={clearFilters}
                            className="px-3 py-2 rounded-xl text-xs border border-slate-300 text-slate-600 hover:bg-slate-50"
                        >
                            Clear
                        </button>
                    </div>
                </div>

                {loading ? (
                    <p className="text-sm text-slate-500">Loading expenses...</p>
                ) : (
                    <ExpenseTable
                        expenses={expenses}
                        onEdit={openEditModal}
                        onDelete={handleDelete}
                    />
                )}

                <ExpenseFormModal
                    isOpen={modalOpen}
                    onClose={() => setModalOpen(false)}
                    onSave={handleSave}
                    initialData={editingExpense}
                />

                {deleteId && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">
                        <div className="bg-white rounded-2xl shadow-soft p-6 w-full max-w-xs text-center">
                            <div className="text-lg font-semibold mb-2">Confirm Deletion</div>
                            <div className="text-sm text-slate-600 mb-4">Are you sure you want to delete this expense?</div>
                            <div className="flex gap-3 justify-center">
                                <button
                                    onClick={() => setDeleteId(null)}
                                    className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    className="px-4 py-2 rounded-xl bg-rose-600 text-white hover:bg-rose-700"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </AnimatedWrapper>
    );
}
