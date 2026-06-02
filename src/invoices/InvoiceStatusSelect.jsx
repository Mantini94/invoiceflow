export default function InvoiceStatusSelect({ selectedInvoice, handleStatusChange }) {
  return (
    <select
      value={selectedInvoice.status || ""}
      onChange={(event) => handleStatusChange(event.target.value)}
    >
      <option value="processing">W trakcie</option>
      <option value="ready">Gotowa</option>
      <option value="duplicate">Duplikat</option>
      <option value="paid">Opłacona</option>
      <option value="to_pay">Do zapłaty</option>
      <option value="error">Błąd</option>
    </select>
  );
}
