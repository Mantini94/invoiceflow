import "./App.css";

import { useAuth } from "./hooks/useAuth";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";

/*
|--------------------------------------------------------------------------
| InvoiceFlow
|--------------------------------------------------------------------------
|
| Frontend:
| - logowanie przez Supabase Auth
| - pobieranie faktur z Supabase
| - podgląd PDF z Supabase Storage przez signed URL
| - filtrowanie faktur
| - szybka analiza lokalna
|
*/

export default function App() {
  const { session, authLoading } = useAuth();

  if (authLoading) {
    return (
      <div className="app">
        <div className="loadingScreen">Sprawdzanie sesji...</div>
      </div>
    );
  }

  if (!session) {
    return <LoginPage />;
  }

  return <DashboardPage />;
}
