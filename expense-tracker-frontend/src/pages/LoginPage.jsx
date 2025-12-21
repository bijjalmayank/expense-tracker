import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosClient";
import AnimatedWrapper from "../components/AnimatedWrapper";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const submit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const res = await api.post("/auth/login", { email, password });
            // set token and user in auth context
            login(res.data.token, res.data.user);
            navigate("/");
        } catch (err) {
            setError(err.response?.data?.message || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatedWrapper>
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50 px-4">
                <div className="w-full max-w-md bg-white/90 backdrop-blur rounded-2xl shadow-soft p-6 sm:p-8">
                    <h2 className="text-2xl sm:text-3xl font-bold text-center mb-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-transparent bg-clip-text">
                        Welcome Back
                    </h2>
                    <p className="text-center text-xs text-slate-500 mb-6">
                        Login to track and manage your daily expenses smartly.
                    </p>

                    <form onSubmit={submit} className="space-y-4">
                        <div>
                            <label className="text-xs text-slate-500">Email</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full mt-1 px-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                                placeholder="you@example.com"
                            />
                        </div>

                        <div>
                            <label className="text-xs text-slate-500">Password</label>
                            <input
                                type="password"
                                required
                                minLength={6}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full mt-1 px-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                                placeholder="••••••••"
                            />
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="button"
                                onClick={() => navigate("/forgot-password")}
                                className="text-xs text-blue-500 font-medium hover:underline mt-1"
                            >
                                Forgot password?
                            </button>
                        </div>

                        {error && (
                            <p className="text-xs text-rose-500 bg-rose-50 border border-rose-100 rounded-lg px-3 py-2">
                                {error}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full mt-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition disabled:opacity-60"
                        >
                            {loading ? "Logging in..." : "Login"}
                        </button>
                    </form>

                    <p className="text-center text-xs text-slate-500 mt-4">
                        Don&apos;t have an account?{" "}
                        <button
                            onClick={() => navigate("/signup")}
                            className="text-blue-500 font-medium hover:underline"
                        >
                            Sign up
                        </button>
                    </p>
                </div>
            </div>
        </AnimatedWrapper>
    );
}
