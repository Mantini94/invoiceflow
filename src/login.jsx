import { useState } from "react";
import { supabase } from "./lib/supabase";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    const { error } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (error) {
      setError("Nieprawidłowy email albo hasło.");
      setLoading(false);
      return;
    }

    setLoading(false);
  };

  return (
    <div className="loginPage">
      <form className="loginCard" onSubmit={handleLogin}>
        <div className="logo loginLogo">IF</div>

        <h1>InvoiceFlow</h1>

        <p>Zaloguj się do panelu faktur.</p>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
        />

        <input
          type="password"
          placeholder="Hasło"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />

        {error && (
          <span className="loginError">
            {error}
          </span>
        )}

        <button type="submit" disabled={loading}>
          {loading ? "Logowanie..." : "Zaloguj"}
        </button>
      </form>
    </div>
  );
}