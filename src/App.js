import { useEffect, useState } from 'react';
import './App.css';
import PathwayList from './components/PathwayList';
import { fetchPathways } from './api/pathwaysApi';
import usePathwayFilters from './hooks/usePathwayFilters';

function App() {
  const [pathwayItems, setPathwayItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dataError, setDataError] = useState('');

  const loadPathways = async () => {
    setIsLoading(true);
    const result = await fetchPathways();
    setPathwayItems(result.pathways);
    setDataError(
      result.usedFallback
        ? `Unable to reach ${result.endpoint}. Loaded local fallback data.`
        : ''
    );
    setIsLoading(false);
  };

  useEffect(() => {
    loadPathways();
  }, []);

  const {
    query,
    selectedEffort,
    selectedType,
    sortBy,
    filteredPathways,
    setQuery,
    setSelectedEffort,
    setSelectedType,
    setSortBy,
    clearFilters,
  } = usePathwayFilters(pathwayItems);

  return (
    <main className="app">
      <section className="hero">
        <h1>LymePath</h1>
        <p>
          Plan what to do next with a lightweight roadmap. Filter by effort,
          type, and priority.
        </p>
      </section>

      <section className="controls" aria-label="Pathway controls">
        <label className="control">
          Search
          <input
            type="search"
            placeholder="Try: sleep, provider, routine"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>

        <label className="control">
          Effort
          <select
            value={selectedEffort}
            onChange={(event) => setSelectedEffort(event.target.value)}
          >
            <option value="all">All</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </label>

        <label className="control">
          Type
          <select
            value={selectedType}
            onChange={(event) => setSelectedType(event.target.value)}
          >
            <option value="all">All</option>
            <option value="medical">Medical</option>
            <option value="lifestyle">Lifestyle</option>
            <option value="tracking">Tracking</option>
            <option value="support">Support</option>
          </select>
        </label>

        <label className="control">
          Sort
          <select
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value)}
          >
            <option value="priority">Priority</option>
            <option value="name">Name</option>
          </select>
        </label>

        <button type="button" className="reset-button" onClick={clearFilters}>
          Reset
        </button>
      </section>

      {!isLoading ? <PathwayList pathways={filteredPathways} /> : null}
      {isLoading ? <p className="status-text">Loading pathways...</p> : null}
      {!isLoading && dataError ? (
        <div className="status-wrap" role="status">
          <p className="status-text">{dataError}</p>
          <button type="button" className="retry-button" onClick={loadPathways}>
            Retry API
          </button>
        </div>
      ) : null}
    </main>
  );
}

export default App;
