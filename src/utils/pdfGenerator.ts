import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export const downloadInvoiceAsPDF = async (invoiceId: string) => {
  const invoiceElement = document.getElementById(`invoice-${invoiceId}`);
  if (!invoiceElement) return;

  const canvas = await html2canvas(invoiceElement);
  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF("p", "mm", "a4");

  pdf.addImage(imgData, "PNG", 10, 10, 190, 0);
  pdf.save(`invoice-${invoiceId}.pdf`);
};
