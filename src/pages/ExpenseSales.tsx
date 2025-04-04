import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from "chart.js";
import { Bar } from "react-chartjs-2";

// ✅ Register Chart.js components
ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

const ExpenseSales = () => {
  const [expenses, setExpenses] = useState<any[]>([]);
  const [sales, setSales] = useState<any[]>([]);
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("sales");

  useEffect(() => {
    const fetchData = async () => {
      const salesSnapshot = await getDocs(collection(db, "sales"));
      setSales(salesSnapshot.docs.map((doc) => doc.data()));

      const expenseSnapshot = await getDocs(collection(db, "expenses"));
      setExpenses(expenseSnapshot.docs.map((doc) => doc.data()));
    };
    fetchData();
  }, []);

  const handleAddTransaction = async () => {
    if (!amount) return;
    const collectionName = type === "sales" ? "sales" : "expenses";
    await addDoc(collection(db, collectionName), {
      amount: Number(amount),
      date: new Date().toISOString(),
    });
    setAmount("");
  };

  const totalSales = sales.reduce((acc, sale) => acc + sale.amount, 0);
  const totalExpenses = expenses.reduce((acc, exp) => acc + exp.amount, 0);
  const profit = totalSales - totalExpenses;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold">Expense & Sales Tracking</h2>

      <div className="my-4 flex gap-4">
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter Amount"
          className="border p-2"
        />
        <select onChange={(e) => setType(e.target.value)} className="border p-2">
          <option value="sales">Sales</option>
          <option value="expenses">Expense</option>
        </select>
        <button onClick={handleAddTransaction} className="bg-blue-500 text-white p-2">
          Add Transaction
        </button>
      </div>

      <div className="bg-gray-100 p-4">
        <p>💰 Total Sales: ₹{totalSales}</p>
        <p>📉 Total Expenses: ₹{totalExpenses}</p>
        <p>📈 Profit: ₹{profit}</p>
      </div>

      <div className="mt-6">
        <Bar
          key={totalSales + totalExpenses} // ✅ Unique key to fix re-rendering issue
          data={{
            labels: ["Sales", "Expenses"],
            datasets: [
              {
                label: "Amount",
                data: [totalSales, totalExpenses],
                backgroundColor: ["green", "red"],
              },
            ],
          }}
        />
      </div>
    </div>
  );
};

export default ExpenseSales;
