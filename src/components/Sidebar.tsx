import React from "react";

const Sidebar = ({ setActivePage }: { setActivePage: (page: string) => void }) => {
  return (
    <div className="w-64 bg-gray-800 text-white p-4">
      <h2 className="text-xl font-bold mb-4">Admin Dashboard</h2>
      <ul>
        <li className="p-2 cursor-pointer hover:bg-gray-700" onClick={() => setActivePage("home")}>🏠 Home</li>
        <li className="p-2 cursor-pointer hover:bg-gray-700" onClick={() => setActivePage("inventory")}>📦 Inventory</li>
        <li className="p-2 cursor-pointer hover:bg-gray-700" onClick={() => setActivePage("billing")}>💳 Billing & Invoicing</li>
        <li className="p-2 cursor-pointer hover:bg-gray-700" onClick={() => setActivePage("invoices")}>📜 Past Invoices</li>
        <li className="p-2 cursor-pointer hover:bg-gray-700" onClick={() => setActivePage("expenses")}>📉 Expenses</li> {/* ✅ Added Expenses */}
        <li onClick={() => setActivePage("vendors")} className="p-2 cursor-pointer">🏢 Vendor Management</li> {/* ✅ New Menu Item */}
      </ul>
    </div>
  );
};

export default Sidebar;
