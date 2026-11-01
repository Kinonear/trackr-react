import { useEffect, useState } from "react";
import Header from "./components/Header.jsx";
import Stats from "./components/Stats.jsx";
import FilterBar from "./components/FilterBar.jsx";
import ApplicationList from "./components/ApplicationList.jsx";
import ApplicationFormDialog from "./components/ApplicationFormDialog.jsx";
import { loadApplications, saveApplications } from "./lib/storage.js";

export default function App() {
  // Lazy initializer: loadApplications runs once, on first render.
  const [applications, setApplications] = useState(loadApplications);
  const [currentFilter, setCurrentFilter] = useState("All");

  // null = dialog closed. { app: null } = create. { app: someApp } = edit.
  const [dialog, setDialog] = useState(null);

  // Any time applications changes, save it. Runs after render.
  useEffect(() => {
    saveApplications(applications);
  }, [applications]);

  function handleSave(data) {
    setApplications((prev) => {
      if (dialog?.app) {
        return prev.map((a) => (a.id === dialog.app.id ? { ...a, ...data } : a));
      }
      return [{ id: crypto.randomUUID(), ...data }, ...prev];
    });
    setDialog(null);
  }

  function handleDelete(id) {
    const app = applications.find((a) => a.id === id);
    if (!app) return;
    if (!confirm(`Delete "${app.role}" at ${app.company}?`)) return;
    setApplications((prev) => prev.filter((a) => a.id !== id));
  }

  return (
    <div className="app">
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