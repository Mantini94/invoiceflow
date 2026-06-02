import { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabase";
import QuickAssistant from "../ai/QuickAssistant";
import Header from "../components/layout/Header";
import { useInvoices } from "../hooks/useInvoices";
import { usePdfPreview } from "../hooks/usePdfPreview";
import InvoiceDetails from "../invoices/InvoiceDetails";
import InvoiceTable from "../invoices/InvoiceTable";
import PdfModal from "../pdf/PdfModal";
import { formatDate, formatDateTime, formatMoney } from "../utils/formatters";
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

  const [aiMessage, setAiMessage] = useState("");
  const [aiResponse, setAiResponse] = useState(
    "Mogę analizować faktury i znajdować problemy."
  );

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
      async () => {
        await fetchInvoices();
      }
    )
    .subscribe();

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

  const runAiAction = (type) => {
    if (type === "review") {
      const review = invoices.filter(
        (invoice) => invoice.needs_review === true || invoice.status === "duplicate"
      );

      setActiveFilter("Do sprawdzenia");
      setAiResponse(`Znaleziono ${review.length} faktur wymagających uwagi.`);
    }

    if (type === "summary") {
      const total = invoices.reduce(
        (sum, invoice) => sum + Number(invoice.gross_amount || 0),
        0
      );

      setAiResponse(`Łączna wartość faktur: ${formatMoney(total)}.`);
    }

    if (type === "duplicates") {
      const duplicates = invoices.filter(
        (invoice) => invoice.is_duplicate === true || invoice.status === "duplicate"
      );

      setActiveFilter("Duplikaty");
      setAiResponse(`Znaleziono ${duplicates.length} duplikatów.`);
    }

    if (type === "missing") {
      const missing = invoices.filter(
        (invoice) =>
          !invoice.invoice_number ||
          !invoice.vendor_name ||
          !invoice.vendor_nip ||
          !invoice.gross_amount
      );

      setAiResponse(`${missing.length} faktur ma brakujące dane.`);
    }

    if (type === "toPay") {
      const toPay = invoices.filter((invoice) => invoice.status === "to_pay");

      setActiveFilter("Do zapłaty");
      setAiResponse(`Pokazuję faktury do zapłaty: ${toPay.length}.`);
    }
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

              <button className="heroSecondary" onClick={() => runAiAction("summary")}>
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
              aiMessage={aiMessage}
              setAiMessage={setAiMessage}
              aiResponse={aiResponse}
              setAiResponse={setAiResponse}
              formatMoney={formatMoney}
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