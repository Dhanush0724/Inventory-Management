import { useState } from "react";
import { generateInvoice } from "../services/invoiceService";
import BarcodeScanner from "../components/BarcodeScanner";
import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebase";

const Billing = () => {
  const [customer, setCustomer] = useState("");
  const [items, setItems] = useState<{ id?: string; name: string; price: number; quantity: number; barcode?: string }[]>([]);
  const [total, setTotal] = useState(0);
  const [showScanner, setShowScanner] = useState(false);

  const updateTotal = (updatedItems: typeof items) => {
    setTotal(updatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0));
  };

  const handleItemChange = (index: number, field: string, value: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
    updateTotal(newItems);
  };

  const handleSubmit = async () => {
    if (!customer || items.length === 0) return alert("Enter customer and at least one item.");
    await generateInvoice(customer, items);
    alert("✅ Invoice generated!");
    setCustomer("");
    setItems([]);
    setTotal(0);
  };

  const handleScannedProduct = async (barcode: string) => {
    setShowScanner(false);
    const q = query(collection(db, "inventory"), where("barcode", "==", barcode));
    const snap = await getDocs(q);

    if (!snap.empty) {
      const doc = snap.docs[0];
      const data = doc.data();
      const id = doc.id;

      const existingIndex = items.findIndex((item) => item.barcode === barcode);
      let updatedItems;

      if (existingIndex >= 0) {
        updatedItems = [...items];
        updatedItems[existingIndex].quantity += 1;
      } else {
        updatedItems = [
          ...items,
          {
            id, // ✅ Add Firestore document ID
            name: data.name,
            price: data.price ?? 0,
            quantity: 1,
            barcode,
          },
        ];
      }

      setItems(updatedItems);
      updateTotal(updatedItems);
      alert(`🛒 Added: ${data.name}`);
    } else {
      alert("❌ Product not found in inventory.");
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">🧾 Billing & Invoicing</h1>

      <input
        type="text"
        placeholder="Customer Name"
        value={customer}
        onChange={(e) => setCustomer(e.target.value)}
        className="border p-2 w-full mb-4"
      />

      <button
        onClick={() => setShowScanner(!showScanner)}
        className="bg-purple-600 text-white px-4 py-2 mb-4 rounded"
      >
        {showScanner ? "Close Scanner" : "Scan Item Barcode"}
      </button>

      {showScanner && (
        <div className="mb-4 border p-2 rounded shadow">
          <BarcodeScanner onDetected={handleScannedProduct} />
        </div>
      )}

      {items.map((item, index) => (
        <div key={index} className="flex space-x-2 mb-2">
          <input
            type="text"
            placeholder="Item"
            value={item.name}
            onChange={(e) => handleItemChange(index, "name", e.target.value)}
            className="border p-2 w-1/3"
          />
          <input
            type="number"
            placeholder="Price"
            value={item.price}
            onChange={(e) => handleItemChange(index, "price", +e.target.value)}
            className="border p-2 w-1/3"
          />
          <input
            type="number"
            placeholder="Qty"
            value={item.quantity}
            onChange={(e) => handleItemChange(index, "quantity", +e.target.value)}
            className="border p-2 w-1/3"
          />
        </div>
      ))}

      <p className="mt-4 font-semibold">🧮 Total: ₹{total}</p>

      <button
        onClick={handleSubmit}
        className="bg-green-500 text-white p-2 mt-4 rounded"
      >
        Generate Invoice
      </button>
    </div>
  );
};

export default Billing;
