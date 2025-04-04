import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs, addDoc, deleteDoc, doc } from "firebase/firestore";

const VendorManagement = () => {
  const [vendors, setVendors] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [company, setCompany] = useState("");

  // Fetch vendors from Firestore
  useEffect(() => {
    const fetchVendors = async () => {
      const snapshot = await getDocs(collection(db, "vendors"));
      setVendors(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };
    fetchVendors();
  }, []);

  // Add a new vendor
  const handleAddVendor = async () => {
    if (!name || !contact || !company) return;
    const newVendor = { name, contact, company };
    await addDoc(collection(db, "vendors"), newVendor);
    setVendors([...vendors, newVendor]); // Update state
    setName("");
    setContact("");
    setCompany("");
  };

  // Delete a vendor
  const handleDeleteVendor = async (id: string) => {
    await deleteDoc(doc(db, "vendors", id));
    setVendors(vendors.filter((vendor) => vendor.id !== id));
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold">Vendor Management</h2>

      <div className="my-4 flex gap-4">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Vendor Name"
          className="border p-2"
        />
        <input
          type="text"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          placeholder="Contact Info"
          className="border p-2"
        />
        <input
          type="text"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          placeholder="Company Name"
          className="border p-2"
        />
        <button onClick={handleAddVendor} className="bg-green-500 text-white p-2">
          Add Vendor
        </button>
      </div>

      <div className="bg-gray-100 p-4">
        <h3 className="text-lg font-semibold">Vendor List</h3>
        <ul>
          {vendors.map((vendor) => (
            <li key={vendor.id} className="flex justify-between p-2 border-b">
              <span>{vendor.name} - {vendor.contact} ({vendor.company})</span>
              <button onClick={() => handleDeleteVendor(vendor.id)} className="bg-red-500 text-white p-1">
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default VendorManagement;
