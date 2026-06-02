import PdfPreview from "../pdf/PdfPreview";
import PdfToolbar from "../pdf/PdfToolbar";
import InvoiceStatusSelect from "./InvoiceStatusSelect";

export default function InvoiceDetails({
  selectedInvoice,
  setSelectedInvoice,
  setPdfUrl,
  pdfUrl,
  setPdfModalOpen,
  openPdfInNewTab,
  downloadPdf,
  refreshPdfUrl,
  fetchInvoices,
  formatDate,
  formatDateTime,
  formatMoney,
  handleStatusChange,
  handleSave,
}) {
  if (!selectedInvoice) return null;

  return (
    <aside className="detailsPanel">
      <div className="detailsTop">
        <h3>{selectedInvoice.invoice_number || "Brak numeru"}</h3>

        <button
          onClick={() => {
            setSelectedInvoice(null);
            setPdfUrl("");
          }}
        >
          x
        </button>
      </div>

      <PdfToolbar
        pdfUrl={pdfUrl}
        setPdfModalOpen={setPdfModalOpen}
        openPdfInNewTab={openPdfInNewTab}
        downloadPdf={downloadPdf}
        refreshPdfUrl={refreshPdfUrl}
      />

      <PdfPreview pdfUrl={pdfUrl} selectedInvoice={selectedInvoice} />

      <div className="aiData">
        <div className="aiDataTop">
          <h4>Dane wyciągnięte przez AI</h4>
          <button onClick={fetchInvoices}>Odśwież</button>
        </div>

        <div className="dataGrid">
          <span>Dostawca</span>
          <strong>{selectedInvoice.vendor_name || "-"}</strong>

          <span>NIP</span>
          <strong>{selectedInvoice.vendor_nip || "-"}</strong>

          <span>Numer faktury</span>
          <strong>{selectedInvoice.invoice_number || "-"}</strong>

          <span>Data wystawienia</span>
          <strong>{formatDate(selectedInvoice.issue_date)}</strong>

          <span>Termin</span>
          <strong>{formatDate(selectedInvoice.due_date)}</strong>

          <span>Netto</span>
          <strong>{formatMoney(selectedInvoice.net_amount)}</strong>

          <span>VAT</span>
          <strong>{formatMoney(selectedInvoice.tax_amount)}</strong>

          <span>Brutto</span>
          <strong>{formatMoney(selectedInvoice.gross_amount)}</strong>

          <span>Duplikat</span>
          <strong>{selectedInvoice.is_duplicate ? "Tak" : "Nie"}</strong>

          <span>Utworzono</span>
          <strong>{formatDateTime(selectedInvoice.created_at)}</strong>
        </div>

        <label>Status</label>

        <InvoiceStatusSelect
          selectedInvoice={selectedInvoice}
          handleStatusChange={handleStatusChange}
        />

        <button className="saveBtn" onClick={handleSave}>
          Zapisz zmiany
        </button>
      </div>
    </aside>
  );
}
