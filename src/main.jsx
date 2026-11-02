import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import AuthScreen from "./components/AuthScreen.jsx";
import { AuthProvider, useAuth } from "./contexts/AuthContext.jsx";
import "./styles.css";

function Root() {
  const { session, loading } = useAuth();

  if (loading) return <p className="app-loading">Loading…</p>;
  if (!session) return <AuthScreen />;
  return <App />;
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <Root />
    </AuthProvider>
  </StrictMode>
);