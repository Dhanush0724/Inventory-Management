import { db } from "../firebase";
import { collection, addDoc, getDocs, Timestamp } from "firebase/firestore";

export const generateInvoice = async (customer: string, items: any[]) => {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  
  const invoice = {
    customer,
    items,
    total,
    createdAt: Timestamp.now(),
  };

  await addDoc(collection(db, "invoices"), invoice);
  return invoice;
};

export const fetchInvoices = async () => {
  const snapshot = await getDocs(collection(db, "invoices"));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};
