import React from "react";
import { downloadInvoiceAsPDF } from "../utils/pdfGenerator";

const InvoiceItem = ({ invoice }: { invoice: any }) => {
  return (
    <div id={`invoice-${invoice.id}`} className="border p-4 mb-2 bg-white">
      <h3 className="text-lg font-bold">Customer: {invoice.customer}</h3>
      <p>Total: ₹{invoice.total}</p>
      <p>Date: {new Date(invoice.createdAt.seconds * 1000).toLocaleString()}</p>
      <button
        onClick={() => downloadInvoiceAsPDF(invoice.id)}
        className="mt-2 bg-blue-500 text-white p-2 rounded"
      >
        📥 Download PDF
      </button>
    </div>
  );
};

export default InvoiceItem;
