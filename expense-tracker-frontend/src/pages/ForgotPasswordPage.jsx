import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosClient";
import AnimatedWrapper from "../components/AnimatedWrapper";

export default function ForgotPasswordPage() {
    const navigate = useNavigate();
    const [step, setStep] = useState("request"); // request, verify, reset
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const requestOTP = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");
        setLoading(true);
        try {
            await api.post("/auth/forgot-password", { email });
            setMessage("If that email exists, an OTP was sent. Check your inbox.");
            setStep("verify");
        } catch (err) {
            setError(err.response?.data?.message || "Failed to request OTP");
        } finally {
            setLoading(false);
        }
    };

    const verify = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            await api.post("/auth/verify-otp", { email, otp });
            setMessage("OTP verified — please enter your new password.");
            setStep("reset");
        } catch (err) {
            setError(err.response?.data?.message || "OTP verification failed");
        } finally {
            setLoading(false);
        }
    };

    const reset = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            await api.post("/auth/reset-password", { email, otp, newPassword });
            setMessage("Password updated. You can now log in.");
            setTimeout(() => navigate("/login"), 1200);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to reset password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatedWrapper>
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50 px-4">
                <div className="w-full max-w-md bg-white/90 backdrop-blur rounded-2xl shadow-soft p-6 sm:p-8">
                    <h2 className="text-2xl sm:text-3xl font-bold text-center mb-2">
                        Forgot Password
                    </h2>

                    {message && (
                        <p className="text-xs text-green-600 bg-green-50 border border-green-100 rounded-lg px-3 py-2">
                            {message}
                        </p>
                    )}

                    {error && (
                        <p className="text-xs text-rose-500 bg-rose-50 border border-rose-100 rounded-lg px-3 py-2">
                            {error}
                        </p>
                    )}

                    {step === "request" && (
                        <form onSubmit={requestOTP} className="space-y-4">
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

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full mt-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition disabled:opacity-60"
                            >
                                {loading ? "Sending..." : "Send OTP"}
                            </button>
                        </form>
                    )}

                    {step === "verify" && (
                        <form onSubmit={verify} className="space-y-4">
                            <div>
                                <label className="text-xs text-slate-500">Enter OTP</label>
                                <input
                                    type="text"
                                    required
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    className="w-full mt-1 px-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    placeholder="6-digit code"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full mt-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition disabled:opacity-60"
                            >
                                {loading ? "Verifying..." : "Verify OTP"}
                            </button>
                        </form>
                    )}

                    {step === "reset" && (
                        <form onSubmit={reset} className="space-y-4">
                            <div>
                                <label className="text-xs text-slate-500">New Password</label>
                                <input
                                    type="password"
                                    required
                                    minLength={6}
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full mt-1 px-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    placeholder="••••••••"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full mt-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition disabled:opacity-60"
                            >
                                {loading ? "Updating..." : "Update Password"}
                            </button>
                        </form>
                    )}

                    <p className="text-center text-xs text-slate-500 mt-4">
                        Remembered?{' '}
                        <button onClick={() => navigate('/login')} className="text-blue-500 font-medium hover:underline">
                            Back to login
                        </button>
                    </p>
                </div>
            </div>
        </AnimatedWrapper>
    );
}
