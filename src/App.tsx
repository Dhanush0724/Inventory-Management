import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/login";
import AdminDashboard from "./pages/AdminDashboard";
import StaffDashboard from "./pages/StaffDashboard";
import ExpenseSales from "./pages/ExpenseSales"; // ✅ Import the new page
import { auth } from "./firebase";
import { useEffect, useState } from "react";
import { User } from "firebase/auth";
import { getDoc, doc } from "firebase/firestore";
import { db } from "./firebase";

const App = () => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setUser(user);
      if (user) {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setRole(userSnap.data().role);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/admin-dashboard"
        element={role === "admin" ? <AdminDashboard /> : <Navigate to="/login" />}
      />
      <Route
        path="/dashboard"
        element={role === "staff" ? <StaffDashboard /> : <Navigate to="/login" />}
      />
      {/* ✅ Add Expense & Sales Tracking Route */}
      <Route
        path="/expenses-sales"
        element={role ? <ExpenseSales /> : <Navigate to="/login" />}
      />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default App;
