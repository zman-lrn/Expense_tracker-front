import { useContext, useState } from "react";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import { DollarSign, Eye, EyeOff, LogOut } from "lucide-react";
import { logoutUser } from "../api/api";
import { BalanceContext } from "../context/BalanceContext";
import Navbar from "./Navbar";

export default function Layout() {
  const navigate = useNavigate();
  const { balance } = useContext(BalanceContext);
  const [hidden, setHidden] = useState(false);
  const location = useLocation();

  const hideHeader =
    location.pathname === "/login" || location.pathname === "/register";

  const handleLogout = () => {
    logoutUser(navigate);
    navigate("/login");
  };

  if (hideHeader) return <Outlet />;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow flex items-center justify-between px-6 py-4 sticky top-0 z-10">
        <h1 className="text-xl font-bold">Expense Tracker</h1>
        <div
          className="flex items-center space-x-2 px-4 py-2 rounded cursor-pointer select-none"
          onClick={() => setHidden(!hidden)}
        >
          <DollarSign className="w-5 h-5 text-green-600" />
          <span className="font-semibold text-green-700 bg-green-100">
            {hidden ? ` ${balance?.balance?.toFixed(2) ?? 0}` : "*****"}
          </span>
          {hidden ? (
            <EyeOff className="w-4 h-4 text-green-700" />
          ) : (
            <Eye className="w-4 h-4 text-green-700" />
          )}
          <button
            onClick={handleLogout}
            className="hover:bg-red-600 text-gray-400 p-2 mr-3 rounded flex items-center justify-center"
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      <main className="p-6">
        <Navbar />
        <Outlet />
      </main>
    </div>
  );
}
