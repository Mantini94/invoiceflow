import { useMemo, useState } from "react";
import {
  DollarSign,
  Wallet,
  FileText,
  ShieldCheck,
} from "lucide-react";

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
    "Nowy",
    "Do sprawdzenia",
    "Do zapłaty",
    "Brakujące dane",
  ];

  const duplicates = invoices.filter(
    (invoice) => invoice.is_duplicate === true || invoice.status === "duplicate"
  );

const missingData = invoices.filter(
  (invoice) =>
    invoice.status === "missing_data" ||
    !invoice.invoice_number ||
    !invoice.vendor_name ||
    !invoice.vendor_nip ||
    !invoice.gross_amount
);

const reviewItems = invoices.filter(
  (invoice) =>
    invoice.needs_review === true ||
    invoice.status === "duplicate" ||
    invoice.status === "review" ||
    invoice.status === "missing_data" ||
    invoice.status === "error" ||
    invoice.status === "to_pay" ||
    !invoice.invoice_number ||
    !invoice.vendor_name ||
    !invoice.vendor_nip ||
    !invoice.gross_amount
);

  const toPay = invoices.filter((invoice) => invoice.status === "to_pay");

  const ready = invoices.filter((invoice) => invoice.status === "ready");

  const newInvoices = invoices.filter(
  (invoice) => invoice.status === "new"
);

  const financialInvoices = invoices.filter(
  (invoice) =>
    invoice.is_duplicate !== true &&
    invoice.status !== "duplicate"
);

const totalValue = financialInvoices.reduce(
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

   financialInvoices.forEach((invoice) => {
  if (!invoice.vendor_name || !invoice.gross_amount) {
    return;
  }

  const vendor = invoice.vendor_name;
  const amount = Number(invoice.gross_amount);

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
      

      
   <div className="executiveLayout">
  <div className="executiveTop">
    <div className="executiveGrid">
     <div className="executiveCard">
  <div className="kpiHeader">
    <div className="kpiIcon"><DollarSign size={22} /></div>
    <span>Łączna wartość faktur</span>
  </div>

  <strong>{formatCompactMoney(totalValue)}</strong>
</div>

<div className="executiveCard">
  <div className="kpiHeader">
    <div className="kpiIcon"><Wallet size={22} /></div>
    <span>Do zapłaty</span>
  </div>

  <strong>{formatCompactMoney(toPayValue)}</strong>
</div>

<div className="executiveCard">
  <div className="kpiHeader">
    <div className="kpiIcon"><FileText size={22} /></div>
    <span>Faktury w bazie</span>
  </div>

  <strong>{invoices.length}</strong>
</div>

<div className="executiveCard">
  <div className="kpiHeader">
    <div className="kpiIcon"> <ShieldCheck size={22} /></div>
    <span>Risk score</span>
  </div>

  <strong>{riskScore}</strong>
  <small>{getRiskLabel()}</small>
</div>
    </div>

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

<div className="executiveGridSmall">

  <button
    onClick={() => {
      setActiveFilter("Wszystkie");
      document.getElementById("invoices")?.scrollIntoView({
        behavior: "smooth",
      });
    }}
  >
    <div className="statIcon">◉</div>
    <div className="statNumber">{invoices.length}</div>
    <div className="statTitle">WSZYSTKIE</div>
    <div className="statDescription">Wszystkie faktury</div>
  </button>

  <button
    onClick={() => {
      setActiveFilter("Duplikaty");
      document.getElementById("invoices")?.scrollIntoView({
        behavior: "smooth",
      });
    }}
  >
    <div className="statIcon">▣</div>
    <div className="statNumber">{duplicates.length}</div>
    <div className="statTitle">DUPLIKATY</div>
    <div className="statDescription">Znalezione duplikaty</div>
  </button>

  <button
    onClick={() => {
      setActiveFilter("Do sprawdzenia");
      document.getElementById("invoices")?.scrollIntoView({
        behavior: "smooth",
      });
    }}
  >
    <div className="statIcon">⌕</div>
    <div className="statNumber">{reviewItems.length}</div>
    <div className="statTitle">DO SPRAWDZENIA</div>
    <div className="statDescription">Wymagają uwagi</div>
  </button>

  <button
    onClick={() => {
      setActiveFilter("Brakujące dane");
      document.getElementById("invoices")?.scrollIntoView({
        behavior: "smooth",
      });
    }}
  >
    <div className="statIcon">◫</div>
    <div className="statNumber">{missingData.length}</div>
    <div className="statTitle">BRAKUJĄCE DANE</div>
    <div className="statDescription">Niekompletne dane</div>
  </button>

  <button
    onClick={() => {
      setActiveFilter("Do zapłaty");
      document.getElementById("invoices")?.scrollIntoView({
        behavior: "smooth",
      });
    }}
  >
    <div className="statIcon">◈</div>
    <div className="statNumber">{toPay.length}</div>
    <div className="statTitle">DO ZAPŁATY</div>
    <div className="statDescription">Oczekujące płatności</div>
  </button>

  <button
    onClick={() => {
      setActiveFilter("Gotowe");
      document.getElementById("invoices")?.scrollIntoView({
        behavior: "smooth",
      });
    }}
  >
    <div className="statIcon">✓</div>
    <div className="statNumber">{ready.length}</div>
    <div className="statTitle">GOTOWE</div>
    <div className="statDescription">Zakończone</div>
  </button>

<button
  onClick={() => {
    setActiveFilter("Nowe");

    document
      .getElementById("invoices")
      ?.scrollIntoView({
        behavior: "smooth",
      });
  }}
>
  <div className="statIcon">◔</div>
  <div className="statNumber">
    {newInvoices.length}
  </div>
  <div className="statTitle">NOWE</div>
  <div className="statDescription">
    Nowe poprawne faktury
  </div>
</button>

</div>
</div>


   
    </div>
  );
}
