import { useMemo, useState } from "react";

const N8N_AI_WEBHOOK_URL =
  "https://n8n-mvj1.srv1505698.hstgr.cloud/webhook/invoice-ai-assistant";

export default function QuickAssistant({
  invoices,
  activeFilter,
  setActiveFilter,
  formatMoney,
  formatCompactMoney,
})  {
  

  const filters = [
    "Wszystkie",
    "Gotowe",
    "Duplikaty",
    "W trakcie",
    "Do sprawdzenia",
    "Do zapłaty",
    "Brakujące dane",
  ];

  const duplicates = invoices.filter(
    (invoice) => invoice.is_duplicate === true || invoice.status === "duplicate"
  );

  const missingData = invoices.filter(
    (invoice) =>
      !invoice.invoice_number ||
      !invoice.vendor_name ||
      !invoice.vendor_nip ||
      !invoice.gross_amount
  );

  const reviewItems = invoices.filter(
    (invoice) => invoice.needs_review === true || invoice.status === "duplicate"
  );

  const toPay = invoices.filter((invoice) => invoice.status === "to_pay");

  const ready = invoices.filter((invoice) => invoice.status === "ready");

  const processing = invoices.filter((invoice) => invoice.status === "processing");

  const totalValue = invoices.reduce(
    (sum, invoice) => sum + Number(invoice.gross_amount || 0),
    0
  );

  const toPayValue = toPay.reduce(
    (sum, invoice) => sum + Number(invoice.gross_amount || 0),
    0
  );

  const mostExpensive = [...invoices].sort(
    (a, b) => Number(b.gross_amount || 0) - Number(a.gross_amount || 0)
  )[0];

  const topVendors = useMemo(() => {
    const vendors = {};

    invoices.forEach((invoice) => {
      const vendor = invoice.vendor_name || "Brak dostawcy";
      const amount = Number(invoice.gross_amount || 0);

      vendors[vendor] = (vendors[vendor] || 0) + amount;
    });

    return Object.entries(vendors)
      .map(([vendor, amount]) => ({ vendor, amount }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);
  }, [invoices]);

  const riskScore =
    duplicates.length * 3 + missingData.length * 2 + reviewItems.length;

  const getRiskLabel = () => {
    if (riskScore >= 15) return "Wysokie ryzyko";
    if (riskScore >= 6) return "Średnie ryzyko";
    return "Niskie ryzyko";
  };

  const addAiResponse = (text) => {
    setAiResponse(text);
  };

  const runAiAction = (type) => {
    if (type === "summary") {
      addAiResponse(
        `Łączna wartość faktur wynosi ${formatMoney(totalValue)}. Do zapłaty pozostaje ${formatMoney(
          toPayValue
        )}.`
      );
      return;
    }

    if (type === "duplicates") {
      setActiveFilter("Duplikaty");
      addAiResponse(`Znaleziono ${duplicates.length} potencjalnych duplikatów.`);
      return;
    }

    if (type === "missing") {
      setActiveFilter("Brakujące dane");
      addAiResponse(`${missingData.length} faktur ma brakujące dane.`);
      return;
    }

    if (type === "review") {
      setActiveFilter("Do sprawdzenia");
      addAiResponse(`${reviewItems.length} faktur wymaga ręcznej kontroli.`);
      return;
    }

    if (type === "toPay") {
      setActiveFilter("Do zapłaty");
      addAiResponse(`Faktur do zapłaty: ${toPay.length}.`);
      return;
    }

    if (type === "highest") {
      if (!mostExpensive) {
        addAiResponse("Brak faktur do analizy.");
        return;
      }

      addAiResponse(
        `Najdroższa faktura to ${
          mostExpensive.invoice_number || "bez numeru"
        } od ${mostExpensive.vendor_name || "brak dostawcy"} na kwotę ${formatMoney(
          mostExpensive.gross_amount
        )}.`
      );
    }
  };

  



  return (
    <div className="quickAssistant" id="ai">
      <div className="quickAssistantTop">
        <div>
          <h3>Executive AI Dashboard</h3>
          <p>Automatyczna analiza faktur, ryzyk i płatności.</p>
        </div>
      </div>

      
    <div className="executiveLayout">

  <div className="executiveLeft">

    <div className="executiveGrid">
      <div className="executiveCard">
        <span>Łączna wartość faktur</span>
<strong>{formatCompactMoney(totalValue)}</strong>
      </div>

      <div className="executiveCard">
        <span>Do zapłaty</span>
        <strong>{formatCompactMoney(toPayValue)}</strong>
      </div>

      <div className="executiveCard">
        <span>Faktury w bazie</span>
        <strong>{invoices.length}</strong>
      </div>

      <div className="executiveCard">
        <span>Risk score</span>
        <strong>{riskScore}</strong>
        <small>{getRiskLabel()}</small>
      </div>
    </div>

    <div className="executiveGridSmall">

      <button
        onClick={() => {
          setActiveFilter("Wszystkie");
          document.getElementById("invoices")?.scrollIntoView({
            behavior: "smooth",
          });
        }}
      >
        Wszystkie: {invoices.length}
      </button>

      <button
        onClick={() => {
          runAiAction("duplicates");
          document.getElementById("invoices")?.scrollIntoView({
            behavior: "smooth",
          });
        }}
      >
        Duplikaty: {duplicates.length}
      </button>

      <button
        onClick={() => {
          runAiAction("review");
          document.getElementById("invoices")?.scrollIntoView({
            behavior: "smooth",
          });
        }}
      >
        Do sprawdzenia: {reviewItems.length}
      </button>

      <button
        onClick={() => {
          runAiAction("missing");
          document.getElementById("invoices")?.scrollIntoView({
            behavior: "smooth",
          });
        }}
      >
        Brakujące dane: {missingData.length}
      </button>

      <button
        onClick={() => {
          runAiAction("toPay");
          document.getElementById("invoices")?.scrollIntoView({
            behavior: "smooth",
          });
        }}
      >
        Do zapłaty: {toPay.length}
      </button>

      <button
        onClick={() => {
          setActiveFilter("Gotowe");
          document.getElementById("invoices")?.scrollIntoView({
            behavior: "smooth",
          });
        }}
      >
        Gotowe: {ready.length}
      </button>

      <button
        onClick={() => {
          setActiveFilter("W trakcie");
          document.getElementById("invoices")?.scrollIntoView({
            behavior: "smooth",
          });
        }}
      >
        W trakcie: {processing.length}
      </button>

    </div>

  </div>

  <div className="executiveRight">

    <div className="executivePanel">
      <h4>Top dostawcy wg wartości faktur</h4>

      {topVendors.length === 0 ? (
        <p>Brak danych dostawców.</p>
      ) : (
        topVendors.map((vendor) => (
          <div className="vendorRow" key={vendor.vendor}>
            <span>{vendor.vendor}</span>
            <strong>{formatMoney(vendor.amount)}</strong>
          </div>
        ))
      )}
    </div>

 

  </div>

</div>



   
    </div>
  );
}
