import { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabase";
import QuickAssistant from "../ai/QuickAssistant";
import Header from "../components/layout/Header";
import { useInvoices } from "../hooks/useInvoices";
import { usePdfPreview } from "../hooks/usePdfPreview";
import InvoiceDetails from "../invoices/InvoiceDetails";
import InvoiceTable from "../invoices/InvoiceTable";
import PdfModal from "../pdf/PdfModal";
import {
  formatDate,
  formatDateTime,
  formatMoney,
  formatCompactMoney,
} from "../utils/formatters";
import {
  filterInvoices,
  getDisplayStatus,
  getStatusClass,
} from "../utils/invoiceHelpers";

export default function DashboardPage() {
  const [activeFilter, setActiveFilter] = useState("Wszystkie");
  const [search, setSearch] = useState("");

  const {
    pdfUrl,
    setPdfUrl,
    pdfModalOpen,
    setPdfModalOpen,
    loadInvoicePdf,
  } = usePdfPreview();

  const {
    invoices,
    selectedInvoice,
    setSelectedInvoice,
    loading,
    errorMessage,
    fetchInvoices,
    saveInvoiceStatus,
  } = useInvoices(loadInvoicePdf);



  useEffect(() => {
    fetchInvoices();
  }, []);

useEffect(() => {
  const channel = supabase
    .channel("invoices-realtime")
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "invoices",
      },
      async (payload) => {
        console.log("Realtime event:", payload);
        await fetchInvoices(false);
      }
    )
    .subscribe((status) => {
      console.log("Realtime status:", status);
    });

  return () => {
    supabase.removeChannel(channel);
  };
}, []);

  const filteredInvoices = useMemo(() => {
    return filterInvoices(invoices, activeFilter, search);
  }, [activeFilter, search, invoices]);

  const handleSelectInvoice = async (invoice) => {
    setSelectedInvoice(invoice);
    await loadInvoicePdf(invoice.file_path);
  };

  const handleStatusChange = (newStatus) => {
    if (!selectedInvoice) return;

    setSelectedInvoice({
      ...selectedInvoice,
      status: newStatus,
    });
  };

  const openPdfInNewTab = () => {
    if (!pdfUrl) return;
    window.open(pdfUrl, "_blank", "noopener,noreferrer");
  };

  const downloadPdf = async () => {
    if (!pdfUrl || !selectedInvoice) return;

    const response = await fetch(pdfUrl);
    const blob = await response.blob();

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `${selectedInvoice.invoice_number || "faktura"}.pdf`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    window.URL.revokeObjectURL(url);
  };

  const refreshPdfUrl = async () => {
    if (!selectedInvoice?.file_path) return;
    await loadInvoicePdf(selectedInvoice.file_path);
  };



  if (loading) {
    return (
      <div className="app">
        <div className="loadingScreen">Ładowanie faktur...</div>
      </div>
    );
  }

  return (
    <div className="app">
      <Header />

      <main className="main">
        <section className="hero" id="start">
          <div className="heroContent">
            <h1>
              Prostsza obsługa
              <br />
              faktur bez <span>chaosu.</span>
            </h1>

            <p>
              System pobiera faktury z maila, analizuje je przez AI i zapisuje dane
              do Supabase.
            </p>

            <div className="heroButtons">
              <button
                className="heroPrimary"
                onClick={() =>
                  document.getElementById("invoices")?.scrollIntoView({
                    behavior: "smooth",
                  })
                }
              >
                Otwórz faktury
              </button>

            <button
            className="heroSecondary"
              onClick={() =>
            document.getElementById("ai")?.scrollIntoView({
            behavior: "smooth",
            })
            }
            >
              Analiza AI
          </button>
            </div>

            <div className="alertBar">
              <span>Faktury w bazie: {invoices.length}</span>
              <div className="dot" />
              <strong>
                {
                  invoices.filter(
                    (invoice) =>
                      invoice.needs_review === true || invoice.status === "duplicate"
                  ).length
                }{" "}
                wymaga uwagi
              </strong>
            </div>
          </div>
        </section>

        <section className="dashboard" id="invoices">
          <section className="centerPanel">
            <div className="tableHeader">
              <div>
                <h2>Faktury</h2>
                <p>Dokumenty zapisane i przeanalizowane przez AI</p>

                {errorMessage && <p className="errorText">{errorMessage}</p>}
              </div>

              <input
                type="text"
                placeholder="Szukaj faktury..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>

            <InvoiceTable
              filteredInvoices={filteredInvoices}
              handleSelectInvoice={handleSelectInvoice}
              formatDate={formatDate}
              formatMoney={formatMoney}
              getStatusClass={getStatusClass}
              getDisplayStatus={getDisplayStatus}
            />

            <QuickAssistant
  invoices={invoices}
  activeFilter={activeFilter}
  setActiveFilter={setActiveFilter}
  formatMoney={formatMoney}
  formatCompactMoney={formatCompactMoney}
/>
          </section>

          <InvoiceDetails
            selectedInvoice={selectedInvoice}
            setSelectedInvoice={setSelectedInvoice}
            setPdfUrl={setPdfUrl}
            pdfUrl={pdfUrl}
            setPdfModalOpen={setPdfModalOpen}
            openPdfInNewTab={openPdfInNewTab}
            downloadPdf={downloadPdf}
            refreshPdfUrl={refreshPdfUrl}
            fetchInvoices={fetchInvoices}
            formatDate={formatDate}
            formatDateTime={formatDateTime}
            formatMoney={formatMoney}
            handleStatusChange={handleStatusChange}
            handleSave={saveInvoiceStatus}
          />
        </section>
      </main>

      <PdfModal
        pdfModalOpen={pdfModalOpen}
        pdfUrl={pdfUrl}
        selectedInvoice={selectedInvoice}
        openPdfInNewTab={openPdfInNewTab}
        downloadPdf={downloadPdf}
        setPdfModalOpen={setPdfModalOpen}
      />
    </div>
  );
}