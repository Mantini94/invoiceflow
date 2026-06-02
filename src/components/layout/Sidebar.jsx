export default function Sidebar({ activeFilter, setActiveFilter }) {
  return (
    <aside className="sidebar">
      {["Wszystkie", "Gotowe", "Duplikaty", "W trakcie", "Do sprawdzenia"].map(
        (filter) => (
          <button
            key={filter}
            className={activeFilter === filter ? "sidebarActive" : ""}
            onClick={() => setActiveFilter(filter)}
          >
            {filter === "Wszystkie" ? "Faktury" : filter}
          </button>
        )
      )}
    </aside>
  );
}
