import { useEffect, useState } from "react";
import api from "../api/axiosClient";
import AnimatedWrapper from "../components/AnimatedWrapper";
import { useAuth } from "../context/AuthContext";

export default function ProfilePage() {
    const { user, updateUser, logout } = useAuth();
    const [form, setForm] = useState({ name: "", email: "" });
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState("");
    const [err, setErr] = useState("");

    const [pwForm, setPwForm] = useState({ currentPassword: "", newPassword: "" });
    const [pwLoading, setPwLoading] = useState(false);
    const [pwMsg, setPwMsg] = useState("");

    useEffect(() => {
        if (user) setForm({ name: user.name || "", email: user.email || "" });
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((f) => ({ ...f, [name]: value }));
    };

    const submit = async (e) => {
        e.preventDefault();
        setErr("");
        setMsg("");
        setLoading(true);
        try {
            const res = await api.put("/auth/me", { name: form.name, email: form.email });
            updateUser(res.data);
            setMsg("Profile updated");
        } catch (err) {
            setErr(err.response?.data?.message || "Update failed");
        } finally {
            setLoading(false);
        }
    };

    const handlePwChange = (e) => {
        const { name, value } = e.target;
        setPwForm((p) => ({ ...p, [name]: value }));
    };

    const submitPw = async (e) => {
        e.preventDefault();
        setPwMsg("");
        setErr("");
        setPwLoading(true);
        try {
            await api.put("/auth/me/password", {
                currentPassword: pwForm.currentPassword,
                newPassword: pwForm.newPassword,
            });
            setPwMsg("Password updated. Please login again.");
            // force logout to require fresh login after password change
            setTimeout(() => logout(), 1200);
        } catch (err) {
            setErr(err.response?.data?.message || "Password change failed");
        } finally {
            setPwLoading(false);
        }
    };

    return (
        <AnimatedWrapper>
            <main className="max-w-3xl mx-auto px-4 py-6">
                <h1 className="text-xl sm:text-2xl font-semibold text-slate-900 mb-4">Profile</h1>

                <div className="bg-white rounded-2xl shadow-soft border border-slate-100 p-4 sm:p-6 mb-6">
                    <form onSubmit={submit} className="space-y-3">
                        <div>
                            <label className="text-xs text-slate-500">Name</label>
                            <input name="name" value={form.name} onChange={handleChange} className="w-full mt-1 px-3 py-2 border rounded-xl" />
                        </div>
                        <div>
                            <label className="text-xs text-slate-500">Email</label>
                            <input name="email" value={form.email} onChange={handleChange} className="w-full mt-1 px-3 py-2 border rounded-xl" />
                        </div>

                        {err && <div className="text-xs text-rose-600">{err}</div>}
                        {msg && <div className="text-xs text-emerald-600">{msg}</div>}

                        <button type="submit" disabled={loading} className="mt-2 px-4 py-2 rounded-xl bg-slate-900 text-white">{loading ? "Saving..." : "Save"}</button>
                    </form>
                </div>

                <div className="bg-white rounded-2xl shadow-soft border border-slate-100 p-4 sm:p-6">
                    <h2 className="text-sm font-medium text-slate-800 mb-3">Change Password</h2>
                    <form onSubmit={submitPw} className="space-y-3">
                        <div>
                            <label className="text-xs text-slate-500">Current Password</label>
                            <input name="currentPassword" type="password" value={pwForm.currentPassword} onChange={handlePwChange} className="w-full mt-1 px-3 py-2 border rounded-xl" />
                        </div>
                        <div>
                            <label className="text-xs text-slate-500">New Password</label>
                            <input name="newPassword" type="password" value={pwForm.newPassword} onChange={handlePwChange} className="w-full mt-1 px-3 py-2 border rounded-xl" />
                        </div>

                        {err && <div className="text-xs text-rose-600">{err}</div>}
                        {pwMsg && <div className="text-xs text-emerald-600">{pwMsg}</div>}

                        <button type="submit" disabled={pwLoading} className="mt-2 px-4 py-2 rounded-xl bg-rose-600 text-white">{pwLoading ? "Updating..." : "Change Password"}</button>
                    </form>
                </div>
            </main>
        </AnimatedWrapper>
    );
}
