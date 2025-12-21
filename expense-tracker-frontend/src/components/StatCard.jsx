import { motion } from "framer-motion";

export default function StatCard({ title, value, subtitle, accent, progress = null, progressLabel = null }) {
    const accentClasses = {
        blue: "from-blue-500/10 to-blue-500/0 border-blue-100",
        green: "from-emerald-500/10 to-emerald-500/0 border-emerald-100",
        orange: "from-orange-500/10 to-orange-500/0 border-orange-100",
        purple: "from-purple-500/10 to-purple-500/0 border-purple-100",
    };

    return (
        <motion.div
            whileHover={{ y: -3, scale: 1.01 }}
            className={`relative overflow-hidden rounded-2xl border bg-white shadow-soft p-4 sm:p-5`}
        >
            <div
                className={`absolute inset-0 bg-gradient-to-br ${accentClasses[accent] || accentClasses.blue
                    } pointer-events-none`}
            />
            <div className="relative">
                <p className="text-xs font-medium text-slate-500">{title}</p>
                <p className="text-2xl sm:text-3xl font-semibold text-slate-900 mt-1">
                    {value}
                </p>
                {subtitle && (
                    <p className="text-xs text-slate-500 mt-1">{subtitle}</p>
                )}
                {progress !== null && (
                    <div className="mt-3">
                        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                            <div
                                className={`h-full rounded-full transition-all duration-300 ${accent === "orange"
                                        ? "bg-orange-400"
                                        : accent === "green"
                                            ? "bg-emerald-500"
                                            : "bg-blue-500"
                                    }`}
                                style={{ width: `${Math.max(0, Math.min(1, progress)) * 100}%` }}
                            />
                        </div>
                        {progressLabel && (
                            <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
                                <div>{progressLabel}</div>
                                <div>{Math.round(Math.max(0, Math.min(1, progress)) * 100)}%</div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </motion.div>
    );
}
