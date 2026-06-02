import { useState } from "react";

const N8N_AI_WEBHOOK_URL =
  "https://n8n-mvj1.srv1505698.hstgr.cloud/webhook-test/invoice-ai-assistant";

export default function QuickAssistant({
  invoices,
  activeFilter,
  setActiveFilter,
  aiMessage,
  setAiMessage,
  aiResponse,
  setAiResponse,
  formatMoney,
}) {
  const [isAiLoading, setIsAiLoading] = useState(false);

  const [chatMessages, setChatMessages] = useState([
    {
      role: "assistant",
      text: aiResponse || "Cześć. Zapytaj mnie o faktury.",
    },
  ]);

  const filters = [
    "Wszystkie",
    "Gotowe",
    "Duplikaty",
    "W trakcie",
    "Do sprawdzenia",
    "Do zapłaty",
    "Brakujące dane",
  ];

  const addAssistantMessage = (text) => {
    setAiResponse(text);
    setChatMessages((prev) => [{ role: "assistant", text }, ...prev]);
  };

  const addUserMessage = (text) => {
    setChatMessages((prev) => [{ role: "user", text }, ...prev]);
  };

  const getInvoicesForReview = () =>
    invoices.filter(
      (invoice) => invoice.needs_review === true || invoice.status === "duplicate"
    );

  const getDuplicates = () =>
    invoices.filter(
      (invoice) => invoice.is_duplicate === true || invoice.status === "duplicate"
    );

  const getMissingData = () =>
    invoices.filter(
      (invoice) =>
        !invoice.invoice_number ||
        !invoice.vendor_name ||
        !invoice.vendor_nip ||
        !invoice.gross_amount
    );

  const getTotalValue = () =>
    invoices.reduce((sum, invoice) => sum + Number(invoice.gross_amount || 0), 0);

  const getReady = () => invoices.filter((invoice) => invoice.status === "ready");

  const getProcessing = () =>
    invoices.filter((invoice) => invoice.status === "processing");

  const getToPay = () => invoices.filter((invoice) => invoice.status === "to_pay");

  const getMostExpensive = () =>
    [...invoices].sort(
      (a, b) => Number(b.gross_amount || 0) - Number(a.gross_amount || 0)
    )[0];

  const runAiAction = (type) => {
    if (type === "summary") {
      addAssistantMessage(`Łączna wartość faktur: ${formatMoney(getTotalValue())}.`);
      return;
    }

    if (type === "duplicates") {
      setActiveFilter("Duplikaty");
      addAssistantMessage(`Znaleziono ${getDuplicates().length} duplikatów.`);
      return;
    }

    if (type === "review") {
      setActiveFilter("Do sprawdzenia");
      addAssistantMessage(
        `Znaleziono ${getInvoicesForReview().length} faktur wymagających uwagi.`
      );
      return;
    }

    if (type === "missing") {
      setActiveFilter("Brakujące dane");
      addAssistantMessage(`${getMissingData().length} faktur ma brakujące dane.`);
      return;
    }

    if (type === "ready") {
      setActiveFilter("Gotowe");
      addAssistantMessage(`Gotowych faktur: ${getReady().length}.`);
      return;
    }

    if (type === "processing") {
      setActiveFilter("W trakcie");
      addAssistantMessage(`Faktur w trakcie przetwarzania: ${getProcessing().length}.`);
      return;
    }

    if (type === "all") {
      setActiveFilter("Wszystkie");
      addAssistantMessage(`Wyświetlam wszystkie faktury. Liczba faktur: ${invoices.length}.`);
      return;
    }

    if (type === "toPay") {
      setActiveFilter("Do zapłaty");
      addAssistantMessage(`Pokazuję faktury do zapłaty: ${getToPay().length}.`);
      return;
    }

    if (type === "highest") {
      const invoice = getMostExpensive();

      if (!invoice) {
        addAssistantMessage("Nie znaleziono faktur do analizy.");
        return;
      }

      addAssistantMessage(
        `Najdroższa faktura to ${
          invoice.invoice_number || "bez numeru"
        } od ${invoice.vendor_name || "nieznanego dostawcy"} na kwotę ${formatMoney(
          invoice.gross_amount
        )}.`
      );
    }
  };

  const askN8nAssistant = async (question) => {
    const response = await fetch(N8N_AI_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        question,
        invoices,
      }),
    });

    if (!response.ok) {
      throw new Error("Błąd połączenia z n8n");
    }

    const data = await response.json();

    return (
      data.answer ||
      data.output ||
      data.text ||
      data.response ||
      "AI nie zwróciło odpowiedzi."
    );
  };

  const answerEmployeeQuestion = async () => {
    const rawQuery = aiMessage.trim();
    const query = rawQuery.toLowerCase();

    if (!query || isAiLoading) return;

    addUserMessage(rawQuery);
    setAiMessage("");

    if (query.includes("duplik")) return runAiAction("duplicates");
    if (query.includes("brak")) return runAiAction("missing");

    if (
      query.includes("suma") ||
      query.includes("łączna") ||
      query.includes("wartość") ||
      query.includes("ile warte")
    ) {
      return runAiAction("summary");
    }

    if (query.includes("gotow")) return runAiAction("ready");

    if (query.includes("trakcie") || query.includes("processing")) {
      return runAiAction("processing");
    }

    if (query.includes("sprawdzenia") || query.includes("uwagi")) {
      return runAiAction("review");
    }

    if (
      query.includes("zapłaty") ||
      query.includes("platnosci") ||
      query.includes("płatności")
    ) {
      return runAiAction("toPay");
    }

    if (
      query.includes("najdroższa") ||
      query.includes("najdrozsza") ||
      query.includes("największa") ||
      query.includes("najwieksza")
    ) {
      return runAiAction("highest");
    }

    if (query.includes("ile") && query.includes("faktur")) {
      addAssistantMessage(`W bazie znajduje się ${invoices.length} faktur.`);
      return;
    }

    try {
      setIsAiLoading(true);

      const answer = await askN8nAssistant(rawQuery);
      addAssistantMessage(answer);
    } catch (error) {
      console.error(error);
      addAssistantMessage("Nie udało się połączyć z n8n. Sprawdź webhook i workflow.");
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="quickAssistant" id="ai">
      <div className="quickAssistantTop">
        <div>
          <h3>Pomoc AI</h3>
          <p>Aktywny filtr: {activeFilter}.</p>
        </div>
      </div>

      <div className="assistantMessages">
        {isAiLoading && (
          <div className="assistantMessage assistantMessageAi assistantMessageLoading">
            AI analizuje...
          </div>
        )}

        {chatMessages.map((message, index) => (
          <div
            key={`${message.role}-${index}`}
            className={
              message.role === "user"
                ? "assistantMessage assistantMessageUser"
                : "assistantMessage assistantMessageAi"
            }
          >
            {message.text}
          </div>
        ))}
      </div>

      <div className="quickActions">
        {filters.map((filter) => (
          <button
            key={filter}
            className={activeFilter === filter ? "quickActionActive" : ""}
            onClick={() => setActiveFilter(filter)}
          >
            {filter === "Wszystkie" ? "Faktury" : filter}
          </button>
        ))}

        <button onClick={() => runAiAction("summary")}>Podsumuj wartość</button>
        <button onClick={() => runAiAction("highest")}>Najdroższa faktura</button>
      </div>

      <div className="assistantInput">
        <input
          type="text"
          placeholder="Zapytaj AI o faktury..."
          value={aiMessage}
          disabled={isAiLoading}
          onChange={(event) => setAiMessage(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              answerEmployeeQuestion();
            }
          }}
        />

        <button onClick={answerEmployeeQuestion} disabled={isAiLoading}>
          ➜
        </button>
      </div>
    </div>
  );
}