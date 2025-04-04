import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, onSnapshot, addDoc, updateDoc, doc } from "firebase/firestore";

const InventoryPage = () => {
  const [inventory, setInventory] = useState<{ id: string; name: string; quantity: number }[]>([]);
  const [newItem, setNewItem] = useState({ name: "", quantity: 0 });

  // 🔄 Fetch inventory in real-time
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "inventory"), (snapshot) => {
      setInventory(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as any)));
    });
    return () => unsubscribe();
  }, []);

  // ➕ Add new inventory item
  const addInventoryItem = async () => {
    if (!newItem.name || newItem.quantity <= 0) return;
    await addDoc(collection(db, "inventory"), newItem);
    setNewItem({ name: "", quantity: 0 });
  };

  // 🛒 Update inventory quantity
  const updateQuantity = async (id: string, change: number) => {
    const item = inventory.find((item) => item.id === id);
    if (item) {
      const itemRef = doc(db, "inventory", id);
      await updateDoc(itemRef, { quantity: item.quantity + change });
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">📦 Inventory Management</h2>

      {/* Add New Inventory */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Item Name"
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
        <button onClick={addInventoryItem} className="bg-blue-500 text-white px-4 py-2">Add</button>
      </div>

      {/* Inventory List */}
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2">Item</th>
            <th className="p-2">Quantity</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {inventory.map((item) => (
            <tr key={item.id} className="border-b">
              <td className="p-2">{item.name}</td>
              <td className="p-2">{item.quantity}</td>
              <td className="p-2 flex gap-2">
                <button onClick={() => updateQuantity(item.id, 1)} className="bg-green-500 text-white px-2">➕</button>
                <button onClick={() => updateQuantity(item.id, -1)} className="bg-red-500 text-white px-2">➖</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InventoryPage;
