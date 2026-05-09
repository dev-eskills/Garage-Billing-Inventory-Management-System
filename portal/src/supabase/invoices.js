import { supabase } from "../lib/supabaseClient";
import { jsPDF } from "jspdf";

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

export const generateInvoicePDF = (job) => {
  const doc = new jsPDF();

  // Header
  doc.setFontSize(24);
  doc.setTextColor(30, 64, 175);
  doc.text("GARAGE INVOICE", 105, 20, { align: "center" });

  // Invoice Meta
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.setFont("helvetica", "bold");
  doc.text(`Invoice Number:`, 20, 40);
  doc.setFont("helvetica", "normal");
  doc.text(`INV-${job.id.slice(0, 8).toUpperCase()}`, 60, 40);
  doc.text(`Date: ${new Date().toLocaleDateString()}`, 140, 40);

  doc.line(20, 45, 190, 45);

  // Customer & Job Info
  doc.setFont("helvetica", "bold");
  doc.text("Bill To:", 20, 55);
  doc.text("Job Details:", 140, 55);
  doc.setFont("helvetica", "normal");
  doc.text(`${job.customers?.customer_details?.name || 'Walk-in'}`, 20, 62);
  doc.text(`${job.job_info?.service_type || 'General Service'}`, 140, 62);

  doc.line(20, 75, 190, 75);

  // Table Logic
  let yPos = 85;
  doc.setFont("helvetica", "bold");
  doc.text("Parts Used", 20, yPos);
  doc.text("Qty", 120, yPos);
  doc.text("Total", 175, yPos);
  yPos += 7;

  doc.setFont("helvetica", "normal");
  if (job.parts_items?.length > 0) {
    job.parts_items.forEach(part => {
      if (yPos > 270) { doc.addPage(); yPos = 20; }
      doc.text(`${part.part_name}`, 20, yPos);
      doc.text(`${part.quantity}`, 120, yPos);
      doc.text(`${part.total_price}`, 175, yPos);
      yPos += 7;
    });
  }

  // Totals
  yPos += 10;
  doc.setFont("helvetica", "bold");
  doc.text("Grand Total:", 120, yPos);
  doc.setTextColor(22, 163, 74);
  doc.text(`INR ${parseFloat(job.total_amount_full_service || 0).toLocaleString()}`, 160, yPos);

  return doc.output('blob');
};

export const uploadAndRecordInvoice = async (jobId, pdfBlob, userId) => {
  const fileName = `inv_${jobId}_${Date.now()}.pdf`;
  const storagePath = `public/${fileName}`;

  // 1. Upload to Storage
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('invoices')
    .upload(storagePath, pdfBlob, {
      contentType: 'application/pdf',
      upsert: false
    });

  if (uploadError) throw uploadError;

  // 2. Get Public URL
  const { data: publicUrlData } = supabase.storage
    .from('invoices')
    .getPublicUrl(storagePath);

  // 3. Save to Table
  const { data, error: dbError } = await supabase
    .from('invoices')
    .insert({
      job_id: jobId,
      file_name: fileName,
      public_url: publicUrlData.publicUrl,
      storage_path: storagePath,
      created_by: userId
    })
    .select()
    .single();

  if (dbError) throw dbError;

  return data; // Returns the saved invoice record
};

export const generateAndSaveInvoice = async (job, userId) => {
  try {
    // Phase 1: Create the PDF
    const pdfBlob = generateInvoicePDF(job);

    // Phase 2: Save to Cloud
    const savedRecord = await uploadAndRecordInvoice(job.id, pdfBlob, userId);

    console.log("Invoice processed successfully:", savedRecord.public_url);
    
    return {
      publicUrl: savedRecord.public_url,
      storagePath: savedRecord.storage_path,
      fileName: savedRecord.file_name
    };

  } catch (error) {
    console.error("Failed to generate/save invoice:", error.message);
    throw error;
  }
};