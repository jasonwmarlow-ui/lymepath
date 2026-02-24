import { useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'lymepath.filters';

const defaultFilters = {
  query: '',
  selectedEffort: 'all',
  selectedType: 'all',
  sortBy: 'priority',
};

function getStoredFilters() {
  const rawFilters = localStorage.getItem(STORAGE_KEY);

  if (!rawFilters) {
    return defaultFilters;
  }

  try {
    const parsedFilters = JSON.parse(rawFilters);
    return {
      ...defaultFilters,
      ...parsedFilters,
    };
  } catch (error) {
    return defaultFilters;
  }
}

function usePathwayFilters(pathways) {
  const initialFilters = getStoredFilters();
  const [query, setQuery] = useState(initialFilters.query);
  const [selectedEffort, setSelectedEffort] = useState(initialFilters.selectedEffort);
  const [selectedType, setSelectedType] = useState(initialFilters.selectedType);
  const [sortBy, setSortBy] = useState(initialFilters.sortBy);

  const filteredPathways = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return pathways
      .filter((pathway) => {
        const searchBlob =
          `${pathway.title} ${pathway.description}`.toLowerCase();
        const matchesQuery =
          normalizedQuery.length === 0 || searchBlob.includes(normalizedQuery);
        const matchesEffort =
          selectedEffort === 'all' || pathway.effort === selectedEffort;
        const matchesType = selectedType === 'all' || pathway.type === selectedType;
        return matchesQuery && matchesEffort && matchesType;
      })
      .sort((left, right) => {
        if (sortBy === 'name') {
          return left.title.localeCompare(right.title);
        }
        return left.priority - right.priority;
      });
  }, [pathways, query, selectedEffort, selectedType, sortBy]);

  const clearFilters = () => {
    setQuery('');
    setSelectedEffort('all');
    setSelectedType('all');
    setSortBy('priority');
  };

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        query,
        selectedEffort,
        selectedType,
        sortBy,
      })
    );
  }, [query, selectedEffort, selectedType, sortBy]);

  return {
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
  };
}

export default usePathwayFilters;
