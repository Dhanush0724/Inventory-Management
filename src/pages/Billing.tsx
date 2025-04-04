import { useState } from "react";
import { generateInvoice } from "../services/invoiceService";

const Billing = () => {
  const [customer, setCustomer] = useState("");
  const [items, setItems] = useState([{ name: "", price: 0, quantity: 1 }]);
  const [total, setTotal] = useState(0);

  const handleItemChange = (index: number, field: string, value: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
    setTotal(newItems.reduce((sum, item) => sum + item.price * item.quantity, 0));
  };

  const handleSubmit = async () => {
    await generateInvoice(customer, items);
    alert("Invoice generated!");
  };

  return (
    <div>
      <h1 className="text-2xl mb-4">Billing & Invoicing</h1>
      <input type="text" placeholder="Customer Name" value={customer} onChange={(e) => setCustomer(e.target.value)} className="border p-2 w-full" />
      {items.map((item, index) => (
        <div key={index} className="flex space-x-2">
          <input type="text" placeholder="Item" onChange={(e) => handleItemChange(index, "name", e.target.value)} className="border p-2 w-1/3" />
          <input type="number" placeholder="Price" onChange={(e) => handleItemChange(index, "price", +e.target.value)} className="border p-2 w-1/3" />
        </div>
      ))}
      <button onClick={handleSubmit} className="bg-green-500 text-white p-2 mt-2">Generate Invoice</button>
    </div>
  );
};

export default Billing;
