export default function PdfPreview({ pdfUrl, selectedInvoice }) {
  return (
    <div className="preview">
      {pdfUrl ? (
        <iframe src={pdfUrl} title="Podgląd faktury" className="pdfFrame" />
      ) : (
        <div className="paper">
          <h2>Brak podglądu PDF</h2>
          <p>Nie znaleziono pliku faktury albo signed URL nie został utworzony.</p>
          <hr />
          <p>File path: {selectedInvoice.file_path || "brak"}</p>
        </div>
      )}
    </div>
  );
}
