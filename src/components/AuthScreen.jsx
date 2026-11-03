import { useState } from "react";
import { useAuth } from "../contexts/AuthContext.jsx";
import { supabase } from "../lib/supabase.js";

export default function AuthScreen() {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState("signin"); // "signin" | "signup"
  const [resetMode, setResetMode] = useState(false); // Controls password reset view
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

  async function handleReset(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      alert("Check your email for a reset link.");
      setResetMode(false);
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
          {resetMode
            ? "Reset your password."
            : mode === "signin"
            ? "Sign in to your account."
            : "Create an account."}
        </p>

        <form className="form" onSubmit={resetMode ? handleReset : handleSubmit}>
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

          {/* Hide password input when in reset mode */}
          {!resetMode && (
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
          )}

          {error && <p className="auth-error">{error}</p>}

          <button className="btn btn-primary" type="submit" disabled={submitting}>
            {submitting
              ? "…"
              : resetMode
              ? "Send reset link"
              : mode === "signin"
              ? "Sign in"
              : "Sign up"}
          </button>
        </form>

        {/* "Forgot password?" toggle when in normal sign-in view */}
        {mode === "signin" && !resetMode && (
          <button
            type="button"
            onClick={() => {
              setError("");
              setResetMode(true);
            }}
            style={{
              background: "none",
              border: "none",
              color: "inherit",
              opacity: 0.75,
              cursor: "pointer",
              fontSize: "0.85rem",
              marginTop: "0.75rem",
              textDecoration: "underline",
            }}
          >
            Forgot password?
          </button>
        )}

        {/* Switch between sign-in / sign-up or back from reset */}
        {resetMode ? (
          <button
            className="auth-switch"
            type="button"
            onClick={() => {
              setError("");
              setResetMode(false);
            }}
          >
            Back to sign in
          </button>
        ) : (
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
        )}
      </div>
    </div>
  );
}