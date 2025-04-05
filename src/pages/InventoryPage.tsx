import { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  doc,
  query,
  where,
  getDocs,
  deleteDoc,
  getDoc,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import Barcode from "react-barcode";
import BarcodeScanner from "../components/BarcodeScanner";

const InventoryPage = () => {
  const [inventory, setInventory] = useState<any[]>([]);
  const [newItem, setNewItem] = useState({ name: "", quantity: 0, barcode: "" });
  const [scannedProduct, setScannedProduct] = useState<any | null>(null);
  const [showScanner, setShowScanner] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "inventory"), (snapshot) => {
      setInventory(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          setIsAdmin(userDoc.data().role === "admin");
        }
      }
    });

    return () => {
      unsubscribe();
      unsubscribeAuth();
    };
  }, []);

  const generateRandomEAN13 = () => {
    const base = Array.from({ length: 12 }, () => Math.floor(Math.random() * 10));
    const sum = base.reduce((acc, val, idx) => acc + val * (idx % 2 === 0 ? 1 : 3), 0);
    const checkDigit = (10 - (sum % 10)) % 10;
    return [...base, checkDigit].join("");
  };

  const isValidEAN = (barcode: string) => /^\d{8}$/.test(barcode) || /^\d{13}$/.test(barcode);

  const addInventoryItem = async () => {
    if (!newItem.name || newItem.quantity <= 0) return;

    let barcode = newItem.barcode.trim();
    if (!barcode) barcode = generateRandomEAN13();
    if (!isValidEAN(barcode)) return alert("Invalid barcode format.");

    await addDoc(collection(db, "inventory"), {
      name: newItem.name,
      quantity: newItem.quantity,
      barcode,
    });

    setNewItem({ name: "", quantity: 0, barcode: "" });
  };

  const updateQuantity = async (id: string, change: number) => {
    const item = inventory.find((item) => item.id === id);
    if (!item) return;
    const ref = doc(db, "inventory", id);
    await updateDoc(ref, { quantity: item.quantity + change });
  };

  const deleteItem = async (id: string) => {
    if (!isAdmin) return alert("❌ Only admins can delete items.");
    await deleteDoc(doc(db, "inventory", id));
  };

  const handleScannedInventory = async (barcode: string) => {
    setShowScanner(false);
    const q = query(collection(db, "inventory"), where("barcode", "==", barcode));
    const snap = await getDocs(q);
    if (!snap.empty) {
      const product = snap.docs[0].data();
      setScannedProduct(product);
      alert(`Found: ${product.name}`);
    } else {
      alert("Not found.");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">📦 Inventory</h2>

      <div className="flex gap-2 mb-4 flex-wrap">
        <input
          type="text"
          placeholder="Name"
          value={newItem.name}
          onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
          className="border p-2"
        />
        <input
          type="number"
          placeholder="Quantity"
          value={newItem.quantity}
          onChange={(e) => setNewItem({ ...newItem, quantity: Number(e.target.value) })}
          className="border p-2"
        />
        <input
          type="text"
          placeholder="Barcode (optional)"
          value={newItem.barcode}
          onChange={(e) => setNewItem({ ...newItem, barcode: e.target.value })}
          className="border p-2"
        />
        <button onClick={addInventoryItem} className="bg-blue-500 text-white px-4 py-2 rounded">
          ➕ Add Item
        </button>
      </div>

      <button
        onClick={() => setShowScanner(!showScanner)}
        className="bg-purple-500 text-white px-4 py-2 mb-4 rounded"
      >
        {showScanner ? "Close Scanner" : "Scan Barcode"}
      </button>

      {showScanner && (
        <div className="mb-4 border p-2 rounded shadow-md">
          <BarcodeScanner onDetected={handleScannedInventory} />
        </div>
      )}

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2">Name</th>
            <th className="p-2">Quantity</th>
            <th className="p-2">Barcode</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {inventory.map((item) => (
            <tr key={item.id} className="border-t text-center">
              <td className="p-2">{item.name}</td>
              <td className="p-2">{item.quantity}</td>
              <td className="p-2">
                {item.barcode && <Barcode value={item.barcode} height={40} width={1.5} />}
              </td>
              <td className="p-2 flex gap-2 justify-center">
                <button
                  onClick={() => updateQuantity(item.id, 1)}
                  className="bg-green-500 text-white px-2 rounded"
                >
                  ➕
                </button>
                <button
                  onClick={() => updateQuantity(item.id, -1)}
                  className="bg-yellow-500 text-white px-2 rounded"
                >
                  ➖
                </button>
                {isAdmin && (
                  <button
                    onClick={() => deleteItem(item.id)}
                    className="bg-red-500 text-white px-2 rounded"
                  >
                    🗑️
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InventoryPage;
