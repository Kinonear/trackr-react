export default function Stats({ applications }) {
  const total = applications.length;
  const interviews = applications.filter((a) => a.status === "Interview").length;
  const offers = applications.filter((a) => a.status === "Offer").length;

  return (
    <section className="stats" aria-label="Summary">
      <StatCard value={total} label="Total" />
      <StatCard value={interviews} label="Interviews" />
      <StatCard value={offers} label="Offers" />
    </section>
  );
}

function StatCard({ value, label }) {
  return (
    <div className="stat-card">
      <span className="stat-value">{value}</span>
      <span className="stat-label">{label}</span>
    </div>
  );
}