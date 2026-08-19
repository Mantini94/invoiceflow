export const getDisplayStatus = (status) => {
const labels = {
  new: "Nowy",
  processing: "Przetwarzanie",
  ready: "Gotowa",
  duplicate: "Duplikat",
  error: "Błąd",
  review: "Do sprawdzenia",
  to_pay: "Do zapłaty",
  missing_data: "Brakujące dane",
};

  return labels[status] || status || "Brak statusu";
};

export const getStatusClass = (status) => {
  if (status === "ready") return "paid";
  if (status === "duplicate" || status === "error" ||  status === "missing_data" || status === "to_pay") {
    return "pending";
  }

  if (status === "new" || status === "processing") {
  return "progress";
}

  
};

export const filterInvoices = (invoices, activeFilter, search) => {
  let result = invoices;

  if (activeFilter === "Gotowe") {
    result = result.filter((invoice) => invoice.status === "ready");
  }

  if (activeFilter === "Duplikaty") {
    result = result.filter(
      (invoice) => invoice.status === "duplicate" || invoice.is_duplicate === true
    );
  }

if (activeFilter === "Nowe") {
  result = result.filter((invoice) => invoice.status === "new");
}

if (activeFilter === "Do sprawdzenia") {
  return invoices.filter(
    (invoice) =>
      invoice.needs_review === true ||
      invoice.status === "duplicate" ||
      invoice.status === "review" ||
      invoice.status === "error" ||
      invoice.status === "to_pay" ||
      !invoice.invoice_number ||
      !invoice.vendor_name ||
      !invoice.vendor_nip ||
      !invoice.gross_amount
  );
}

  if (activeFilter === "Do zapłaty") {
    result = result.filter((invoice) => invoice.status === "to_pay");
  }

if (activeFilter === "Brakujące dane") {
  result = result.filter(
    (invoice) =>
      invoice.status === "missing_data" ||
      !invoice.invoice_number ||
      !invoice.vendor_name ||
      !invoice.vendor_nip ||
      !invoice.gross_amount
  );
}

  if (search.trim()) {
    const query = search.toLowerCase();

    result = result.filter((invoice) => {
      const searchable = [
        invoice.invoice_number,
        invoice.vendor_name,
        invoice.vendor_nip,
        invoice.status,
        invoice.duplicate_key,
        getDisplayStatus(invoice.status),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchable.includes(query);
    });
  }

  return result;
};