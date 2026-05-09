import { supabase } from "../lib/supabaseClient";

export const fetchAllInvoices = async () => {
  const { data, error } = await supabase
    .from('invoices')
    .select(`
      *,
      jobs (
        *,
        mechanic:profiles (
          full_name,
          role
        )
      )
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

import { jsPDF } from "jspdf";

export const downloadInvoice = async (path, name) => {
  const { data, error } = await supabase.storage
    .from('invoices')
    .download(path);

  if (error) {
    alert("Error downloading file: " + error.message);
    return;
  }

  // Create a temporary link to trigger the browser download
  const url = URL.createObjectURL(data);
  const a = document.createElement('a');
  a.href = url;
  a.download = name || 'invoice.pdf';
  a.click();
  URL.revokeObjectURL(url);
};

export const generateAndSaveInvoice = async (job, userId) => {
  // 1. Generate PDF Blob
  const doc = new jsPDF();
  
  doc.setFontSize(24);
  doc.setTextColor(30, 64, 175); // Blue
  doc.text("GARAGE INVOICE", 105, 20, { align: "center" });
  
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  
  // Invoice Details
  doc.setFont("helvetica", "bold");
  doc.text(`Invoice Number:`, 20, 40);
  doc.setFont("helvetica", "normal");
  doc.text(`INV-${job.id.slice(0, 8).toUpperCase()}`, 60, 40);
  
  doc.setFont("helvetica", "bold");
  doc.text(`Date:`, 140, 40);
  doc.setFont("helvetica", "normal");
  doc.text(`${new Date().toLocaleDateString()}`, 155, 40);
  
  doc.line(20, 45, 190, 45); // horizontal line
  
  // Customer Info
  doc.setFont("helvetica", "bold");
  doc.text("Bill To:", 20, 55);
  doc.setFont("helvetica", "normal");
  doc.text(`${job.customers?.customer_details?.name || 'Walk-in Customer'}`, 20, 62);
  doc.text(`${job.customers?.customer_details?.contact || 'N/A'}`, 20, 69);
  
  // Job Info
  doc.setFont("helvetica", "bold");
  doc.text("Job Details:", 140, 55);
  doc.setFont("helvetica", "normal");
  doc.text(`${job.job_info?.service_type || 'General Service'}`, 140, 62);
  doc.text(`${job.job_info?.repair_issue || 'N/A'}`, 140, 69);

  doc.line(20, 75, 190, 75);

  let yPos = 85;

  // Parts List
  doc.setFont("helvetica", "bold");
  doc.text("Parts Used", 20, yPos);
  doc.text("Qty", 120, yPos);
  doc.text("Price", 150, yPos);
  doc.text("Total", 175, yPos);
  yPos += 7;
  
  doc.setFont("helvetica", "normal");
  if (job.parts_items && job.parts_items.length > 0) {
    job.parts_items.forEach(part => {
      // Check if yPos exceeds page height, add new page if needed
      if (yPos > 270) {
        doc.addPage();
        yPos = 20;
      }
      doc.text(`${part.part_name || 'Part'}`, 20, yPos);
      doc.text(`${part.quantity}`, 120, yPos);
      doc.text(`${part.unit_price}`, 150, yPos);
      doc.text(`${part.total_price}`, 175, yPos);
      yPos += 7;
    });
  } else {
    doc.text("No parts used.", 20, yPos);
    yPos += 7;
  }

  yPos += 5;
  doc.line(20, yPos, 190, yPos);
  yPos += 10;

  // Extra service and Totals
  doc.setFont("helvetica", "bold");
  doc.text("Extra Service:", 120, yPos);
  doc.setFont("helvetica", "normal");
  doc.text(`INR ${job.extra_service?.amount || 0}`, 160, yPos);
  yPos += 7;

  doc.setFont("helvetica", "bold");
  doc.text("Discount:", 120, yPos);
  doc.setFont("helvetica", "normal");
  doc.text(`${job.discount_percentage || 0}%`, 160, yPos);
  yPos += 10;

  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Grand Total:", 120, yPos);
  doc.setTextColor(22, 163, 74); // Green
  doc.text(`INR ${parseFloat(job.total_amount_full_service || 0).toLocaleString()}`, 160, yPos);

  const pdfBlob = doc.output('blob');
  
  // 2. Upload to Supabase Storage
  const fileName = `inv_${job.id}_${Date.now()}.pdf`;
  const storagePath = `public/${fileName}`;

  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('invoices')
    .upload(storagePath, pdfBlob, {

      contentType: 'application/pdf',
      upsert: false
    });

  if (uploadError) throw uploadError;

  const { data: publicUrlData } = supabase.storage
    .from('invoices')
    .getPublicUrl(storagePath);

  const publicUrl = publicUrlData.publicUrl;

  // 3. Save to invoices table
  const invoiceData = {
    job_id: job.id,
    file_name: fileName,
    public_url: publicUrl,
    storage_path: storagePath,
    created_by: userId
  };

  const { error: dbError } = await supabase
    .from('invoices')
    .insert(invoiceData);

  if (dbError) {
      console.error("Error saving invoice record to DB:", dbError);
  }

  return { publicUrl, storagePath, fileName };
}
