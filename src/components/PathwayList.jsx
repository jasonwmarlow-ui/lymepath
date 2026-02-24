import PathwayCard from './PathwayCard';

function PathwayList({ pathways }) {
  if (pathways.length === 0) {
    return (
      <section className="empty-state" aria-live="polite">
        <h2>No pathways match your filters</h2>
        <p>Try broadening your search or reset the controls.</p>
      </section>
    );
  }

  return (
    <section>
      <h2 className="list-title">Suggested pathways ({pathways.length})</h2>
      <div className="pathway-grid">
        {pathways.map((pathway) => (
          <PathwayCard key={pathway.id} pathway={pathway} />
        ))}
      </div>
    </section>
  );
}

export default PathwayList;
