import { useState } from "react";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import InventoryManager from "../components/InventoryManager";
import Invoices from "../components/Invoices";
import VendorManagement from "./VendorManagement";

const StaffDashboard = () => {
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState("home");

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar Menu */}
      <div className="w-64 bg-gray-800 text-white p-4">
        <h2 className="text-xl font-bold mb-4">Staff Dashboard</h2>
        <ul>
          <li className="p-2 cursor-pointer hover:bg-gray-700" onClick={() => setActivePage("home")}>🏠 Home</li>
          <li className="p-2 cursor-pointer hover:bg-gray-700" onClick={() => setActivePage("inventory")}>📦 Inventory</li>
          <li className="p-2 cursor-pointer hover:bg-gray-700" onClick={() => setActivePage("invoices")}>📜 Invoices</li>
          <li className="p-2 cursor-pointer hover:bg-gray-700" onClick={() => setActivePage("vendors")}>🏢 Vendor Management</li> {/* ✅ Added */}
      </ul>
        <button onClick={handleLogout} className="mt-4 bg-red-500 text-white p-2 w-full">🚪 Logout</button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        {activePage === "home" && <h2 className="text-2xl">Welcome, Staff!</h2>}
        {activePage === "inventory" && <InventoryManager />}
        {activePage === "invoices" && <Invoices />}
        {activePage === "vendors" && <VendorManagement />} 
      </div>
    </div>
  );
};

export default StaffDashboard;
