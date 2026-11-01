export default function ApplicationCard({ app, onEdit, onDelete }) {
  const hasLink = /^https?:\/\//i.test(app.url);

  return (
    <article className="card">
      <div className="card-main">
        <h2 className="card-role">{app.role}</h2>
        <p className="card-company">{app.company}</p>
        <p className="card-meta">
          {app.date}
          {hasLink && (
            <>
              {" · "}
              <a href={app.url} target="_blank" rel="noopener noreferrer">
                Job posting
              </a>
            </>
          )}
        </p>
        {app.notes && <p className="card-notes">{app.notes}</p>}
      </div>
      <div className="card-side">
        <span className={`badge badge-${app.status.toLowerCase()}`}>{app.status}</span>
        <div className="card-actions">
          <button className="btn btn-ghost" type="button" onClick={onEdit}>
            Edit
          </button>
          <button className="btn btn-ghost btn-danger" type="button" onClick={onDelete}>
            Delete
          </button>
        </div>
      </div>
    </article>
  );
}