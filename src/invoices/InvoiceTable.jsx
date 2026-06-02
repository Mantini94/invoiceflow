import InvoiceRow from "./InvoiceRow";

export default function InvoiceTable({
  filteredInvoices,
  handleSelectInvoice,
  formatDate,
  formatMoney,
  getStatusClass,
  getDisplayStatus,
}) {
  return (
    <div className="table">
      <div className="tableHead">
        <span>Numer</span>
        <span>Dostawca</span>
        <span>Termin</span>
        <span>Kwota</span>
        <span>Status</span>
      </div>

      {filteredInvoices.length === 0 ? (
        <div className="tableEmpty">
          <h3>Brak faktur</h3>
          <p>Nie znaleziono dokumentów dla aktualnego filtra.</p>
        </div>
      ) : (
        filteredInvoices.map((invoice) => (
          <InvoiceRow
            key={invoice.id}
            invoice={invoice}
            handleSelectInvoice={handleSelectInvoice}
            formatDate={formatDate}
            formatMoney={formatMoney}
            getStatusClass={getStatusClass}
            getDisplayStatus={getDisplayStatus}
          />
        ))
      )}
    </div>
  );
}
