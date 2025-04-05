import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs, addDoc } from "firebase/firestore";
import JsBarcode from "jsbarcode";

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

  const generateBarcode = () => {
    const timestamp = Date.now().toString();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, "0");
    return (timestamp + random).slice(0, 13); // EAN13 format
  };

  const generateBarcodeImage = (barcode: string) => {
    const canvas = document.createElement("canvas");
    JsBarcode(canvas, barcode, {
      format: "EAN13",
      displayValue: true,
      width: 2,
      height: 50,
    });
    return canvas.toDataURL("image/png");
  };

  const addItem = async () => {
    if (!newItem.name || newItem.quantity <= 0) return;

    const barcode = generateBarcode();
    const barcodeImage = generateBarcodeImage(barcode);

    const item = { ...newItem, barcode, barcodeImage };
    const docRef = await addDoc(collection(db, "inventory"), item);

    setItems([...items, { id: docRef.id, ...item }]);
    setNewItem({ name: "", quantity: 0 });
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">📦 Inventory Management</h2>

      <div className="flex flex-wrap mb-4 gap-2">
        <input
          type="text"
          placeholder="Item Name"
          value={newItem.name}
          onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
          className="border p-2 flex-1"
        />
        <input
          type="number"
          placeholder="Quantity"
          value={newItem.quantity}
          onChange={(e) => setNewItem({ ...newItem, quantity: +e.target.value })}
          className="border p-2 w-32"
        />
        <button onClick={addItem} className="bg-blue-600 text-white px-4 py-2 rounded">
          Add
        </button>
      </div>

      <table className="table-auto w-full border-collapse border text-sm">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-4 py-2">Item</th>
            <th className="border px-4 py-2">Quantity</th>
            <th className="border px-4 py-2">Barcode</th>
            <th className="border px-4 py-2">Barcode Image</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <tr key={item.id}>
              <td className="border px-4 py-2">{item.name}</td>
              <td className="border px-4 py-2">{item.quantity}</td>
              <td className="border px-4 py-2">{item.barcode}</td>
              <td className="border px-4 py-2">
                {item.barcodeImage && (
                  <a
                    href={item.barcodeImage}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    View Barcode
                  </a>
                )}
              </td>
              <td className="border px-4 py-2">+ / -</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InventoryManager;
