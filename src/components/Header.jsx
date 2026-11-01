export default function Header({ onAdd }) {
  return (
    <header className="header">
      <div>
        <h1>Trackr</h1>
        <p className="tagline">Keep track of every application.</p>
      </div>
      <button className="btn btn-primary" type="button" onClick={onAdd}>
        + Add application
      </button>
    </header>
  );
}