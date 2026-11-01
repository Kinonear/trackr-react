const STATUSES = ["All", "Wishlist", "Applied", "Interview", "Offer", "Rejected"];

export default function FilterBar({ current, onChange }) {
  return (
    <nav className="filters" aria-label="Filter by status">
      {STATUSES.map((status) => (
        <button
          key={status}
          className={`filter ${status === current ? "is-active" : ""}`}
          type="button"
          onClick={() => onChange(status)}
        >
          {status}
        </button>
      ))}
    </nav>
  );
}