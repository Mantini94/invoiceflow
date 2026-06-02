import { supabase } from "../../lib/supabase";

export default function Header() {
  return (
    <header className="topbar">
      <div className="logoWrapper">
        <div className="logo">IF</div>
        <span>InvoiceFlow</span>
      </div>

      <nav className="nav">
        <a href="#start">Start</a>
        <a href="#invoices">Faktury</a>
        <a href="#ai">AI</a>
      </nav>

      <div className="topButtons">
        <button className="loginBtn" onClick={() => supabase.auth.signOut()}>
          Wyloguj
        </button>

        <button className="dashboardBtn">Panel pracownika</button>
      </div>
    </header>
  );
}
