import { useEffect, useState } from "react";
import Header from "./components/Header.jsx";
import Stats from "./components/Stats.jsx";
import FilterBar from "./components/FilterBar.jsx";
import ApplicationList from "./components/ApplicationList.jsx";
import ApplicationFormDialog from "./components/ApplicationFormDialog.jsx";
import { supabase } from "./lib/supabase.js";
import { useAuth } from "./contexts/AuthContext.jsx";

export default function App() {
  const { user, signOut } = useAuth();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentFilter, setCurrentFilter] = useState("All");
  const [dialog, setDialog] = useState(null);

  // Load this user's applications whenever the user changes.
  useEffect(() => {
    if (!user) return;
    let cancelled = false;

    (async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("applications")
        .select("*")
        .order("date", { ascending: false });

      if (cancelled) return;
      if (error) {
        setError(error.message);
      } else {
        setApplications(data ?? []);
      }
      setLoading(false);
    })();

    return () => { cancelled = true; };
  }, [user]);

  async function handleSave(data) {
    if (dialog?.app) {
      // Update
      const { error } = await supabase
        .from("applications")
        .update(data)
        .eq("id", dialog.app.id);
      if (error) { setError(error.message); return; }
      setApplications((prev) =>
        prev.map((a) => (a.id === dialog.app.id ? { ...a, ...data } : a))
      );
    } else {
      // Insert — note user_id is required and must match the auth user.
      const { data: inserted, error } = await supabase
        .from("applications")
        .insert({ ...data, user_id: user.id })
        .select()
        .single();
      if (error) { setError(error.message); return; }
      setApplications((prev) => [inserted, ...prev]);
    }
    setDialog(null);
  }

  async function handleDelete(id) {
    const app = applications.find((a) => a.id === id);
    if (!app) return;
    if (!confirm(`Delete "${app.role}" at ${app.company}?`)) return;

    const { error } = await supabase.from("applications").delete().eq("id", id);
    if (error) { setError(error.message); return; }
    setApplications((prev) => prev.filter((a) => a.id !== id));
  }

  if (loading) {
  return (
    <div className="app">
      <p className="app-loading">Loading your applications…</p>
    </div>
  );
}

  return (
    <div className="app">
      <div className="app-topbar">
        <span className="app-user">{user.email}</span>
        <button className="btn btn-ghost" type="button" onClick={signOut}>
          Sign out
        </button>
      </div>

      {error && <p className="app-error">{error}</p>}

      <Header onAdd={() => setDialog({ app: null })} />
      <Stats applications={applications} />
      <FilterBar current={currentFilter} onChange={setCurrentFilter} />
      <ApplicationList
        applications={applications}
        filter={currentFilter}
        onEdit={(app) => setDialog({ app })}
        onDelete={handleDelete}
      />
      {dialog && (
        <ApplicationFormDialog
          initialApp={dialog.app}
          onSave={handleSave}
          onClose={() => setDialog(null)}
        />
      )}
    </div>
  );
}