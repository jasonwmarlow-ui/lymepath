const priorityLabels = {
  1: 'Immediate',
  2: 'Soon',
  3: 'Planned',
  4: 'Optional',
  5: 'Backlog',
};

function PathwayCard({ pathway }) {
  return (
    <article className="pathway-card">
      <div className="pathway-header">
        <h3>{pathway.title}</h3>
        <span className="chip chip-priority">{priorityLabels[pathway.priority]}</span>
      </div>
      <p>{pathway.description}</p>
      <div className="chip-row">
        <span className="chip">{pathway.effort} effort</span>
        <span className="chip">{pathway.type}</span>
      </div>
    </article>
  );
}

export default PathwayCard;
