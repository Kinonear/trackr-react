import ApplicationCard from "./ApplicationCard.jsx";

export default function ApplicationList({ applications, filter, onEdit, onDelete }) {
  const visible =
    filter === "All" ? applications : applications.filter((a) => a.status === filter);

  if (visible.length === 0) {
    return (
      <section className="list" aria-label="Applications">
        <div className="empty">
          <p className="empty-title">Nothing here yet</p>
          <p className="empty-text">
            {filter === "All"
              ? "Add your first application to get started."
              : `No applications with status "${filter}".`}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="list" aria-label="Applications">
      {visible.map((app) => (
        <ApplicationCard
          key={app.id}
          app={app}
          onEdit={() => onEdit(app)}
          onDelete={() => onDelete(app.id)}
        />
      ))}
    </section>
  );
}