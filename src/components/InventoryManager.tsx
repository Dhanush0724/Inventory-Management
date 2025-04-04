import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs, addDoc } from "firebase/firestore";

const InventoryManager = () => {
  const [items, setItems] = useState<any[]>([]);
  const [newItem, setNewItem] = useState({ name: "", quantity: 0 });

  useEffect(() => {
    const fetchInventory = async () => {
      const snapshot = await getDocs(collection(db, "inventory"));
      setItems(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchInventory();
  }, []);

  const addItem = async () => {
    if (!newItem.name || newItem.quantity <= 0) return;
    await addDoc(collection(db, "inventory"), newItem);
    setItems([...items, newItem]);
    setNewItem({ name: "", quantity: 0 });
  };

  return (
    <div>
      <h2 className="text-xl mb-4">📦 Inventory Manager</h2>
      <input type="text" placeholder="Item Name" value={newItem.name} onChange={(e) => setNewItem({ ...newItem, name: e.target.value })} className="border p-2 mr-2" />
      <input type="number" placeholder="Quantity" value={newItem.quantity} onChange={(e) => setNewItem({ ...newItem, quantity: +e.target.value })} className="border p-2 mr-2" />
      <button onClick={addItem} className="bg-blue-500 text-white p-2">➕ Add Item</button>

      <ul className="mt-4">
        {items.map((item) => (
          <li key={item.id} className="border p-2 my-1">{item.name} - {item.quantity}</li>
        ))}
      </ul>
    </div>
  );
};

export default InventoryManager;
