import { useState } from "react";
import { useAuth } from "../contexts/AuthContext.jsx";

export default function AuthScreen() {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState("signin"); // "signin" | "signup"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      if (mode === "signup") await signUp(email, password);
      else await signIn(email, password);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-screen">
      <div className="auth-card">
        <h1>Trackr</h1>
        <p className="auth-subtitle">
          {mode === "signin" ? "Sign in to your account." : "Create an account."}
        </p>

        <form className="form" onSubmit={handleSubmit}>
          <label className="field">
            <span>Email</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </label>

          <label className="field">
            <span>Password</span>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
            />
          </label>

          {error && <p className="auth-error">{error}</p>}

          <button className="btn btn-primary" type="submit" disabled={submitting}>
            {submitting ? "…" : mode === "signin" ? "Sign in" : "Sign up"}
          </button>
        </form>

        <button
          className="auth-switch"
          type="button"
          onClick={() => {
            setMode(mode === "signin" ? "signup" : "signin");
            setError("");
          }}
        >
          {mode === "signin"
            ? "New here? Create an account"
            : "Already have an account? Sign in"}
        </button>
      </div>
    </div>
  );
}