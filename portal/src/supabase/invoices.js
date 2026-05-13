import { supabase } from "../lib/supabaseClient";
import { jsPDF } from "jspdf";

export const fetchAllInvoices = async ({
  mechanicId,
  page = 1,
  limit = 10,
  search = "",
} = {}) => {
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase
    .from("invoices")
    .select(
      `
      *,
      jobs (
        *,
        mechanic:profiles (
          full_name,
          role
        ),
        customers (*)
      )
    `,
      { count: "exact" },
    )
    .order("created_at", { ascending: false })
    .range(from, to);

  // Only filter by mechanic when mechanicId is provided (mechanic portal view)
  // Admin view fetches all invoices (no filter)
  if (mechanicId) {
    query = query.eq("created_by", mechanicId);
  }

  // 🔎 Search
  if (search) {
    query = query.or(`file_name.ilike.%${search}%`);
  }

  const { data, error, count } = await query;
  console.log("invoices from supabase:", data);
  if (error) throw error;

  return {
    data,
    total: count,
    page,
    limit,
  };
};

export const fetchInvoiceById = async (invoiceId) => {
  const { data, error } = await supabase
    .from("invoices")
    .select(
      `
      *,
      jobs (
        *,
        mechanic:profiles (
          id,
          full_name,
          role
        ),
        customers (*)
      )
    `,
    )
    .eq("id", invoiceId)
    .single();

  if (error) throw error;

  return data;
};

export const fetchInvoiceByJobId = async (jobId) => {
  const { data, error } = await supabase
    .from("invoices")
    .select(
      `
      *
    `,
    )
    .eq("job_id", jobId) // ✅ FIX HERE
    .single();

  if (error) throw error;

  return data;
};

export const downloadInvoice = async (path, name) => {
  const { data, error } = await supabase.storage
    .from("invoices")
    .download(path);

  if (error) {
    alert("Error downloading file: " + error.message);
    return;
  }

  // Create a temporary link to trigger the browser download
  const url = URL.createObjectURL(data);
  const a = document.createElement("a");
  a.href = url;
  a.download = name || "invoice.pdf";
  a.click();
  URL.revokeObjectURL(url);
};

export const generateInvoicePDF = (data) => {
  const doc = new jsPDF();
  // Based on your API response, the actual job data is inside 'data.jobs'
  const job = data.jobs || data;
  const customer = job.customers?.customer_details;
  const vehicle = job.customers?.vehicle_details;

  // --- Header ---
  doc.setFontSize(24);
  doc.setTextColor(30, 64, 175); // Blue-600
  doc.text("SERVICE INVOICE", 105, 20, { align: "center" });

  // --- Invoice Meta ---
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.setFont("helvetica", "normal");
  doc.text(`Invoice ID: ${data.id?.slice(0, 8).toUpperCase()}`, 20, 30);
  doc.text(`Date: ${new Date(data.created_at).toLocaleDateString()}`, 160, 30);

  doc.setDrawColor(200);
  doc.line(20, 35, 190, 35);

  // --- Customer & Vehicle Info ---
  doc.setFontSize(11);
  doc.setTextColor(0);
  doc.setFont("helvetica", "bold");
  doc.text("CUSTOMER DETAILS", 20, 45);
  doc.text("VEHICLE & MECHANIC", 110, 45);

  doc.setFont("helvetica", "normal");
  doc.text(`${job.customers?.customer_details?.name || "Walk-in"}`, 20, 62);
  doc.text(`${job.job_info?.service_type || "General Service"}`, 140, 62);

  doc.text(`Vehicle: ${vehicle?.model || 'N/A'}`, 110, 52);
  doc.text(`Reg No: ${vehicle?.vehicle_number || 'N/A'}`, 110, 58);
  doc.text(`Mechanic: ${job.mechanic?.full_name || 'N/A'}`, 110, 64);

  // --- Service Info ---
  doc.setFillColor(245, 247, 250);
  doc.rect(20, 72, 170, 12, 'F');
  doc.setFont("helvetica", "bold");
  doc.text(`Service: ${job.job_info?.service_type || 'General Service'}`, 25, 80);

  // --- Table Header ---
  let yPos = 100;
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("Description", 20, yPos);
  doc.text("Qty", 100, yPos);
  doc.text("Unit Price", 130, yPos);
  doc.text("Total", 170, yPos);

  doc.line(20, yPos + 2, 190, yPos + 2);
  yPos += 10;

  // --- Render Parts ---
  doc.setFont("helvetica", "normal");
  if (job.parts_items?.length > 0) {
    job.parts_items.forEach((part) => {
      if (yPos > 270) {
        doc.addPage();
        yPos = 20;
      }
      doc.text(`${part.part_name}`, 20, yPos);
      doc.text(`${part.quantity}`, 100, yPos);
      doc.text(`${part.unit_price}`, 130, yPos);
      doc.text(`${part.total_price}`, 170, yPos);
      yPos += 8;
    });
  }

  // --- Render Extra Services (Car Wash, etc.) ---
  if (job.extra_service?.amount > 0) {
    doc.setFont("helvetica", "italic");
    doc.text(`${job.extra_service.description || 'Extra Service'}`, 20, yPos);
    doc.text("1", 100, yPos);
    doc.text(`${job.extra_service.amount}`, 130, yPos);
    doc.text(`${job.extra_service.amount}`, 170, yPos);
    yPos += 10;
  }

  // --- Totals Section ---
  yPos = Math.max(yPos, 150); // Ensure totals are pushed down
  doc.line(120, yPos, 190, yPos);
  yPos += 8;

  doc.setFont("helvetica", "normal");
  doc.text("Discount:", 120, yPos);
  doc.text(`${job.discount_percentage}%`, 170, yPos);

  yPos += 8;
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Grand Total:", 120, yPos);
  doc.setTextColor(22, 163, 74);
  doc.text(
    `INR ${parseFloat(job.total_amount_full_service || 0).toLocaleString()}`,
    160,
    yPos,
  );

  return doc.output("blob");
};
// export const generateInvoicePDF = (job) => {
//   const doc = new jsPDF();

//   // Header
//   doc.setFontSize(24);
//   doc.setTextColor(30, 64, 175);
//   doc.text("GARAGE INVOICE", 105, 20, { align: "center" });

//   // Invoice Meta
//   doc.setFontSize(12);
//   doc.setTextColor(0, 0, 0);
//   doc.setFont("helvetica", "bold");
//   doc.text(`Invoice Number:`, 20, 40);
//   doc.setFont("helvetica", "normal");
//   doc.text(`INV-${job.id.slice(0, 8).toUpperCase()}`, 60, 40);
//   doc.text(`Date: ${new Date().toLocaleDateString()}`, 140, 40);

//   doc.line(20, 45, 190, 45);

//   // Customer & Job Info
//   doc.setFont("helvetica", "bold");
//   doc.text("Bill To:", 20, 55);
//   doc.text("Job Details:", 140, 55);
//   doc.setFont("helvetica", "normal");
//   doc.text(`${job.customers?.customer_details?.name || 'Walk-in'}`, 20, 62);
//   doc.text(`${job.job_info?.service_type || 'General Service'}`, 140, 62);

//   doc.line(20, 75, 190, 75);

//   // Table Logic
//   let yPos = 85;
//   doc.setFont("helvetica", "bold");
//   doc.text("Parts Used", 20, yPos);
//   doc.text("Qty", 120, yPos);
//   doc.text("Total", 175, yPos);
//   yPos += 7;

//   doc.setFont("helvetica", "normal");
//   if (job.parts_items?.length > 0) {
//     job.parts_items.forEach(part => {
//       if (yPos > 270) { doc.addPage(); yPos = 20; }
//       doc.text(`${part.part_name}`, 20, yPos);
//       doc.text(`${part.quantity}`, 120, yPos);
//       doc.text(`${part.total_price}`, 175, yPos);
//       yPos += 7;
//     });
//   }

//   // Totals
//   yPos += 10;
//   doc.setFont("helvetica", "bold");
//   doc.text("Grand Total:", 120, yPos);
//   doc.setTextColor(22, 163, 74);
//   doc.text(`INR ${parseFloat(job.total_amount_full_service || 0).toLocaleString()}`, 160, yPos);

//   return doc.output('blob');
// };

export const uploadAndRecordInvoice = async (jobId, pdfBlob, userId) => {
  const fileName = `inv_${jobId}_${Date.now()}.pdf`;
  const storagePath = `public/${fileName}`;

  // 1. Upload to Storage
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from("invoices")
    .upload(storagePath, pdfBlob, {
      contentType: "application/pdf",
      upsert: false,
    });

  if (uploadError) throw uploadError;

  // 4. Get Public URL
  const { data: publicUrlData } = supabase.storage
    .from("invoices")
    .getPublicUrl(storagePath);

  // 5. Upsert to Table (insert or update if job_id already exists)
  const { data, error: dbError } = await supabase
    .from("invoices")
    .insert({
      job_id: jobId,
      file_name: fileName,
      public_url: publicUrlData.publicUrl,
      storage_path: storagePath,
      created_by: userId,
    })
    .select()
    .single();

  if (dbError) throw dbError;

  return data;
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
      fileName: savedRecord.file_name,
    };
  } catch (error) {
    console.error("Failed to generate/save invoice:", error.message);
    throw error;
  }
};
