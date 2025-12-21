export default function ExpenseTable({ expenses, onEdit, onDelete }) {
    const categoryColor = (cat) => {
        switch (cat) {
            case "food":
                return "bg-orange-100 text-orange-700";
            case "travel":
                return "bg-blue-100 text-blue-700";
            case "shopping":
                return "bg-purple-100 text-purple-700";
            case "bills":
                return "bg-rose-100 text-rose-700";
            default:
                return "bg-slate-100 text-slate-700";
        }
    };

    return (
        <div className="overflow-x-auto rounded-2xl border bg-white shadow-soft">
            <table className="min-w-full text-sm">
                <thead className="bg-slate-50 text-xs text-slate-500 uppercase">
                    <tr>
                        <th className="px-4 py-3 text-left">Title</th>
                        <th className="px-4 py-3 text-left">Category</th>
                        <th className="px-4 py-3 text-right">Amount</th>
                        <th className="px-4 py-3 text-left">Date</th>
                        <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {expenses.length === 0 && (
                        <tr>
                            <td
                                colSpan={5}
                                className="text-center text-slate-500 py-6 text-sm"
                            >
                                No expenses found.
                            </td>
                        </tr>
                    )}

                    {expenses.map((exp) => (
                        <tr
                            key={exp._id}
                            className="border-t border-slate-100 hover:bg-slate-50/60"
                        >
                            <td className="px-4 py-3">
                                <div className="font-medium text-slate-800">{exp.title}</div>
                                {exp.notes && (
                                    <div className="text-xs text-slate-500">{exp.notes}</div>
                                )}
                            </td>
                            <td className="px-4 py-3">
                                <span
                                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${categoryColor(
                                        exp.category
                                    )}`}
                                >
                                    {exp.category}
                                </span>
                            </td>
                            <td className="px-4 py-3 text-right font-medium text-slate-900">
                                ₹{exp.amount.toFixed(2)}
                            </td>
                            <td className="px-4 py-3 text-sm text-slate-500">
                                {new Date(exp.date).toLocaleDateString()}
                            </td>
                            <td className="px-4 py-3 text-right">
                                <button
                                    onClick={() => onEdit(exp)}
                                    className="text-xs px-3 py-1.5 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 mr-2"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => onDelete(exp._id)}
                                    className="text-xs px-3 py-1.5 rounded-full bg-rose-50 text-rose-600 hover:bg-rose-100"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
