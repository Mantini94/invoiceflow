export default function PdfToolbar({
  pdfUrl,
  setPdfModalOpen,
  openPdfInNewTab,
  downloadPdf,
  refreshPdfUrl,
}) {
  return (
    <div className="pdfToolbar">
      <button onClick={() => setPdfModalOpen(true)} disabled={!pdfUrl}>
        Powiększ
      </button>

      <button onClick={openPdfInNewTab} disabled={!pdfUrl}>
        Nowa karta
      </button>

      <button onClick={downloadPdf} disabled={!pdfUrl}>
        Pobierz
      </button>

      <button onClick={refreshPdfUrl}>Odśwież link</button>
    </div>
  );
}
