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

  const hasMissingData =
    !invoice.vendor_nip ||
    !invoice.invoice_number ||
    !invoice.vendor_name ||
    !invoice.gross_amount;

  if (invoice.is_duplicate || invoice.status === "duplicate") {
    reasons.push("Duplicate invoice");
  }

  if (invoice.status === "review") {
    reasons.push("Manual review required");
  }

  if (invoice.status === "error") {
    reasons.push("Processing error");
  }

  if (!invoice.vendor_nip) reasons.push("Missing NIP");
  if (!invoice.invoice_number) reasons.push("Missing invoice number");
  if (!invoice.vendor_name) reasons.push("Missing vendor name");
  if (!invoice.gross_amount) reasons.push("Missing amount");
  if (amount > 50000) reasons.push("Very high amount");

  if (
    invoice.is_duplicate ||
    invoice.status === "duplicate" ||
    invoice.status === "review" ||
    invoice.status === "error" ||
    hasMissingData ||
    amount > 50000
  ) {
    return {
      label: "HIGH",
      className: "riskHigh",
      reason: reasons.join(" • "),
    };
  }

  if (invoice.status === "to_pay") {
    return {
      label: "MEDIUM",
      className: "riskMedium",
      reason: "Waiting for payment approval",
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
