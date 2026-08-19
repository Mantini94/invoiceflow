export default function InvoiceStatusSelect({
  selectedInvoice,
  handleStatusChange,
}) {
  return (
    <select
      value={selectedInvoice.status || ""}
      onChange={(event) =>
        handleStatusChange(event.target.value)
      }
    >
      <option value="new">Nowy</option>

      <option value="processing" disabled>
        Przetwarzanie
      </option>

      <option value="ready">Gotowa</option>
      <option value="duplicate">Duplikat</option>
      <option value="missing_data">Brakujące dane</option>
      <option value="to_pay">Do zapłaty</option>
    </select>
  );
}