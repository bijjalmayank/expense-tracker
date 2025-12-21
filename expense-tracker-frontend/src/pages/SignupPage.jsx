import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosClient";
import AnimatedWrapper from "../components/AnimatedWrapper";

export default function SignupPage() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ name: "", email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [successMsg, setSuccessMsg] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((f) => ({ ...f, [name]: value }));
    };

    const submit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccessMsg("");
        setLoading(true);
        try {
            await api.post("/auth/signup", form);
            setSuccessMsg("Signup successful! Please login.");
            setTimeout(() => navigate("/login"), 1000);
        } catch (err) {
            setError(err.response?.data?.message || "Signup failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatedWrapper>
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50 px-4">
                <div className="w-full max-w-md bg-white/90 backdrop-blur rounded-2xl shadow-soft p-6 sm:p-8">
                    <h2 className="text-2xl sm:text-3xl font-bold text-center mb-2 bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500 text-transparent bg-clip-text">
                        Create an account
                    </h2>
                    <p className="text-center text-xs text-slate-500 mb-6">
                        Sign up to start tracking your expenses.
                    </p>

                    <form onSubmit={submit} className="space-y-4">
                        <div>
                            <label className="text-xs text-slate-500">Name</label>
                            <input
                                name="name"
                                required
                                value={form.name}
                                onChange={handleChange}
                                placeholder="Your name"
                                className="w-full mt-1 px-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                        </div>

                        <div>
                            <label className="text-xs text-slate-500">Email</label>
                            <input
                                type="email"
                                name="email"
                                required
                                value={form.email}
                                onChange={handleChange}
                                placeholder="you@example.com"
                                className="w-full mt-1 px-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                        </div>

                        <div>
                            <label className="text-xs text-slate-500">Password</label>
                            <input
                                type="password"
                                name="password"
                                required
                                minLength={6}
                                value={form.password}
                                onChange={handleChange}
                                placeholder="At least 6 characters"
                                className="w-full mt-1 px-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                        </div>

                        {error && (
                            <p className="text-xs text-rose-500 bg-rose-50 border border-rose-100 rounded-lg px-3 py-2">
                                {error}
                            </p>
                        )}

                        {successMsg && (
                            <p className="text-xs text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-lg px-3 py-2">
                                {successMsg}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full mt-2 bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500 text-white py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition disabled:opacity-60"
                        >
                            {loading ? "Creating account..." : "Sign up"}
                        </button>
                    </form>

                    <p className="text-center text-xs text-slate-500 mt-4">
                        Already have an account?{" "}
                        <button
                            onClick={() => navigate("/login")}
                            className="text-blue-500 font-medium hover:underline"
                        >
                            Login
                        </button>
                    </p>
                </div>
            </div>
        </AnimatedWrapper>
    );
}
