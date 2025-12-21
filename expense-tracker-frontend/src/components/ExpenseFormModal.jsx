import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const categories = [
    "food",
    "travel",
    "shopping",
    "bills",
    "other",
];

export default function ExpenseFormModal({
    isOpen,
    onClose,
    onSave,
    initialData,
}) {
    const [form, setForm] = useState({
        title: "",
        amount: "",
        category: "food",
        date: "",
        notes: "",
    });

    useEffect(() => {
        if (initialData) {
            setForm({
                title: initialData.title || "",
                amount: initialData.amount || "",
                category: initialData.category || "food",
                date: initialData.date
                    ? initialData.date.slice(0, 10)
                    : new Date().toISOString().slice(0, 10),
                notes: initialData.notes || "",
            });
        } else {
            setForm({
                title: "",
                amount: "",
                category: "food",
                date: new Date().toISOString().slice(0, 10),
                notes: "",
            });
        }
    }, [initialData, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((f) => ({ ...f, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({
            ...form,
            amount: Number(form.amount),
        });
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm px-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div
                        initial={{ scale: 0.9, y: 10, opacity: 0 }}
                        animate={{ scale: 1, y: 0, opacity: 1 }}
                        exit={{ scale: 0.9, y: 10, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="w-full max-w-md bg-white rounded-2xl shadow-soft p-5"
                    >
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="text-lg font-semibold text-slate-900">
                                {initialData ? "Edit Expense" : "Add Expense"}
                            </h3>
                            <button
                                onClick={onClose}
                                className="text-slate-400 hover:text-slate-600 text-xl leading-none"
                            >
                                ×
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-3">
                            <div>
                                <label className="text-xs text-slate-500">Title</label>
                                <input
                                    name="title"
                                    value={form.title}
                                    onChange={handleChange}
                                    required
                                    className="w-full mt-1 px-3 py-2 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                                />
                            </div>

                            <div className="flex gap-3">
                                <div className="flex-1">
                                    <label className="text-xs text-slate-500">Amount</label>
                                    <input
                                        name="amount"
                                        type="number"
                                        value={form.amount}
                                        onChange={handleChange}
                                        required
                                        min="0"
                                        className="w-full mt-1 px-3 py-2 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    />
                                </div>

                                <div className="flex-1">
                                    <label className="text-xs text-slate-500">Category</label>
                                    <select
                                        name="category"
                                        value={form.category}
                                        onChange={handleChange}
                                        className="w-full mt-1 px-3 py-2 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    >
                                        {categories.map((c) => (
                                            <option key={c} value={c}>
                                                {c.charAt(0).toUpperCase() + c.slice(1)}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="text-xs text-slate-500">Date</label>
                                <input
                                    name="date"
                                    type="date"
                                    value={form.date}
                                    onChange={handleChange}
                                    className="w-full mt-1 px-3 py-2 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                                />
                            </div>

                            <div>
                                <label className="text-xs text-slate-500">Notes</label>
                                <textarea
                                    name="notes"
                                    value={form.notes}
                                    onChange={handleChange}
                                    rows={2}
                                    className="w-full mt-1 px-3 py-2 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full mt-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition"
                            >
                                {initialData ? "Save Changes" : "Add Expense"}
                            </button>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
