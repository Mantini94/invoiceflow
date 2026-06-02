export default function InvoiceRow({
  invoice,
  handleSelectInvoice,
  formatDate,
  formatMoney,
  getStatusClass,
  getDisplayStatus,
}) {
  const getRiskData = () => {
    const reasons = [];
    const amount = Number(invoice.gross_amount || 0);

    if (invoice.is_duplicate || invoice.status === "duplicate") {
      reasons.push("Duplicate invoice");
    }

    if (invoice.status === "error") {
      reasons.push("Processing error");
    }

    if (!invoice.vendor_nip) reasons.push("Missing NIP");
    if (!invoice.invoice_number) reasons.push("Missing invoice number");
    if (!invoice.due_date) reasons.push("Missing due date");
    if (amount > 50000) reasons.push("Very high amount");

    if (
      invoice.is_duplicate ||
      invoice.status === "duplicate" ||
      invoice.status === "error" ||
      amount > 50000 ||
      (!invoice.vendor_nip && amount > 10000)
    ) {
      return {
        label: "HIGH",
        className: "riskHigh",
        reason: reasons.join(" • "),
      };
    }

    if (reasons.length > 0) {
      return {
        label: "MEDIUM",
        className: "riskMedium",
        reason: reasons.join(" • "),
      };
    }

    return {
      label: "LOW",
      className: "riskLow",
      reason: "No suspicious signals",
    };
  };

  const risk = getRiskData();

  return (
    <div className="tableRow" onClick={() => handleSelectInvoice(invoice)}>
      <div className="invoiceNumberCell">
        <span>{invoice.invoice_number || "Brak numeru"}</span>

        <div className={`riskBadge ${risk.className}`} title={risk.reason}>
          {risk.label}
        </div>
      </div>

      <span>{invoice.vendor_name || "Brak dostawcy"}</span>
      <span>{formatDate(invoice.due_date)}</span>
      <span>{formatMoney(invoice.gross_amount)}</span>

      <div className={`status ${getStatusClass(invoice.status)}`}>
        {getDisplayStatus(invoice.status)}
      </div>
    </div>
  );
}
