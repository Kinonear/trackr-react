import { useEffect, useRef } from "react";

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export default function ApplicationFormDialog({ initialApp, onSave, onClose }) {
  const dialogRef = useRef(null);

  // Called once when the dialog mounts. Guard against StrictMode double-run.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    const form = e.target;
    onSave({
      company: form.company.value.trim(),
      role: form.role.value.trim(),
      date: form.date.value,
      status: form.status.value,
      url: form.url.value.trim(),
      notes: form.notes.value.trim(),
    });
  }

  return (
    <dialog
      ref={dialogRef}
      className="dialog"
      onClose={onClose} // fires on Escape, on .close(), etc.
    >
      <form className="form" onSubmit={handleSubmit}>
        <h2 className="form-title">
          {initialApp ? "Edit application" : "Add application"}
        </h2>

        <label className="field">
          <span>Company</span>
          <input
            name="company"
            type="text"
            required
            placeholder="Acme Studio"
            defaultValue={initialApp?.company ?? ""}
          />
        </label>

        <label className="field">
          <span>Role</span>
          <input
            name="role"
            type="text"
            required
            placeholder="Frontend Developer"
            defaultValue={initialApp?.role ?? ""}
          />
        </label>

        <div className="field-row">
          <label className="field">
            <span>Date</span>
            <input
              name="date"
              type="date"
              required
              defaultValue={initialApp?.date ?? todayISO()}
            />
          </label>
          <label className="field">
            <span>Status</span>
            <select
              name="status"
              required
              defaultValue={initialApp?.status ?? "Applied"}
            >
              <option>Wishlist</option>
              <option>Applied</option>
              <option>Interview</option>
              <option>Offer</option>
              <option>Rejected</option>
            </select>
          </label>
        </div>

        <label className="field">
          <span>Job link</span>
          <input
            name="url"
            type="url"
            placeholder="https://example.com/job"
            defaultValue={initialApp?.url ?? ""}
          />
        </label>

        <label className="field">
          <span>Notes</span>
          <textarea
            name="notes"
            rows="3"
            placeholder="Recruiter name, follow-up date, anything useful…"
            defaultValue={initialApp?.notes ?? ""}
          />
        </label>

        <div className="form-actions">
          <button
            className="btn btn-ghost"
            type="button"
            onClick={() => dialogRef.current?.close()}
          >
            Cancel
          </button>
          <button className="btn btn-primary" type="submit">
            Save
          </button>
        </div>
      </form>
    </dialog>
  );
}