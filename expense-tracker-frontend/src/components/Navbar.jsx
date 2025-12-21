import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [open, setOpen] = useState(false);
    const menuRef = useRef();

    useEffect(() => {
        const handler = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false);
        };
        window.addEventListener("click", handler);
        return () => window.removeEventListener("click", handler);
    }, []);

    const doLogout = () => {
        logout();
        navigate("/login", { replace: true });
    };

    const isActive = (path) =>
        location.pathname === path ? "text-blue-600" : "text-slate-500";

    const initials = user?.name ? user.name.split(" ")[0].charAt(0).toUpperCase() : "U";

    return (
        <header className="sticky top-0 z-20 bg-white/90 backdrop-blur border-b border-slate-200">
            <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                        ET
                    </div>
                    <span className="font-semibold text-slate-800 text-lg">Expense Tracker</span>
                </div>

                <nav className="flex items-center gap-4 text-sm font-medium">
                    <Link className={isActive("/")} to="/">
                        Dashboard
                    </Link>
                    <Link className={isActive("/expenses")} to="/expenses">
                        Expenses
                    </Link>
                    <Link className={isActive("/budget")} to="/budget">
                        Budget
                    </Link>

                    <div className="relative" ref={menuRef}>
                        <button
                            onClick={() => setOpen((s) => !s)}
                            className="ml-4 w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center font-medium text-slate-700"
                            title={user?.name || "Profile"}
                        >
                            {initials}
                        </button>

                        {open && (
                            <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg py-1 text-sm">
                                <button
                                    onClick={() => {
                                        setOpen(false);
                                        navigate("/profile");
                                    }}
                                    className="w-full text-left px-3 py-2 hover:bg-slate-50"
                                >
                                    Profile
                                </button>
                                <button
                                    onClick={doLogout}
                                    className="w-full text-left px-3 py-2 text-rose-600 hover:bg-slate-50"
                                >
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </nav>
            </div>
        </header>
    );
}
