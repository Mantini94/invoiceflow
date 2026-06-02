export default function PdfModal({
  pdfModalOpen,
  pdfUrl,
  selectedInvoice,
  openPdfInNewTab,
  downloadPdf,
  setPdfModalOpen,
}) {
  if (!pdfModalOpen || !pdfUrl) return null;

  return (
    <div className="pdfModal">
      <div className="pdfModalTop">
        <strong>{selectedInvoice?.invoice_number || "Podgląd faktury"}</strong>

        <div>
          <button onClick={openPdfInNewTab}>Nowa karta</button>
          <button onClick={downloadPdf}>Pobierz</button>
          <button onClick={() => setPdfModalOpen(false)}>Zamknij</button>
        </div>
      </div>

      <iframe src={pdfUrl} title="Pełny podgląd faktury" className="pdfModalFrame" />
    </div>
  );
}
