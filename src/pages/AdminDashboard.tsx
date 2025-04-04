import { useState } from "react";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import Sidebar from "../components/Sidebar";
import InventoryPage from "./InventoryPage";
import Billing from "./Billing";
import Invoices from "../components/Invoices";
import Expenses from "./ExpenseSales";
import VendorManagement from "./VendorManagement";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState("home");

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  return (
    <div className="flex h-screen">
      <Sidebar setActivePage={setActivePage} />
      <div className="flex-1 p-6">
        {activePage === "home" && <h2 className="text-2xl">Welcome, Admin!</h2>}
        {activePage === "inventory" && <InventoryPage />}
        {activePage === "billing" && <Billing />}
        {activePage === "invoices" && <Invoices />}
        {activePage === "expenses" && <Expenses />} {/* ✅ Added Expenses Feature */}
        {activePage === "vendors" && <VendorManagement />} {/* ✅ New Feature */}
        <button onClick={handleLogout} className="mt-4 bg-red-500 text-white p-2 w-full">🚪 Logout</button>
      </div>
    </div>
  );
};

export default AdminDashboard;
