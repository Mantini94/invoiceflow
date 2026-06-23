import { useState } from "react";

import { getInvoices, updateInvoiceStatus } from "../services/invoiceService";

export function useInvoices(loadInvoicePdf) {
  const [invoices, setInvoices] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

const fetchInvoices = async (showLoading = true) => {
  if (showLoading) {
    setLoading(true);
  }

  setErrorMessage("");

  const { data, error } = await getInvoices();

  if (error) {
    console.error("Błąd Supabase:", error);
    setErrorMessage("Nie udało się pobrać faktur z Supabase.");

    if (showLoading) {
      setLoading(false);
    }

    return;
  }

  const rows = data || [];

  setInvoices(rows);

  if (rows.length > 0) {
    setSelectedInvoice((currentInvoice) => {
      if (!currentInvoice) {
        return rows[0];
      }

      return (
        rows.find((invoice) => invoice.id === currentInvoice.id) ||
        rows[0]
      );
    });
  } else {
    setSelectedInvoice(null);
    await loadInvoicePdf("");
  }

  if (showLoading) {
    setLoading(false);
  }
};

  const saveInvoiceStatus = async () => {
    if (!selectedInvoice) return;

    const { error } = await updateInvoiceStatus(
      selectedInvoice.id,
      selectedInvoice.status
    );

    if (error) {
      console.error("Błąd zapisu:", error);
      alert("Nie udało się zapisać statusu.");
      return;
    }

    await fetchInvoices();
    alert("Status zapisany.");
  };

  return {
    invoices,
    setInvoices,
    selectedInvoice,
    setSelectedInvoice,
    loading,
    errorMessage,
    fetchInvoices,
    saveInvoiceStatus,
  };
}
