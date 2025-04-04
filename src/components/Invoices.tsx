import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import InvoiceItem from "../components/InvoiceItem";

const Invoices = () => {
  const [invoices, setInvoices] = useState<any[]>([]);

  useEffect(() => {
    const fetchInvoices = async () => {
      const querySnapshot = await getDocs(collection(db, "invoices"));
      setInvoices(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchInvoices();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Invoices</h2>
      {invoices.map(invoice => (
        <InvoiceItem key={invoice.id} invoice={invoice} />
      ))}
    </div>
  );
};

export default Invoices;
