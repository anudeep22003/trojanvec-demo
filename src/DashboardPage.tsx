import React, { useState, useMemo } from 'react';
import { FilterBar } from './components/FilterBar';
import { QueryTable } from './components/QueryTable';
import { FilterConfig, SavedFilter, Severity } from './types';
import { mockQueries, mockSavedFilters, DEFAULT_FILTER } from './data';
import { ShieldAlert } from 'lucide-react';

function App() {
  const [filters, setFilters] = useState<FilterConfig>(DEFAULT_FILTER);
  const [savedFilters, setSavedFilters] = useState<SavedFilter[]>(mockSavedFilters);

  const filteredAndSortedQueries = useMemo(() => {
    let result = [...mockQueries];

    // Apply filters
    if (filters.severities.length > 0) {
      result = result.filter((query) => filters.severities.includes(query.severity));
    }
    if (filters.categories.length > 0) {
      result = result.filter((query) => filters.categories.includes(query.category));
    }

    // Apply sorting
    result.sort((a, b) => {
      switch (filters.sortBy) {
        case 'most_recent':
          return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
        case 'severity_high_low': {
          const severityOrder: Record<Severity, number> = {
              Critical: 3, High: 2, Medium: 1, Low: 0,
              Info: 0
          };
          return severityOrder[b.severity] - severityOrder[a.severity];
        }
        case 'severity_low_high': {
          const severityOrder: Record<Severity, number> = {
              Critical: 3, High: 2, Medium: 1, Low: 0,
              Info: 0
          };
          return severityOrder[a.severity] - severityOrder[b.severity];
        }
        default:
          return 0;
      }
    });

    return result;
  }, [filters]);

  const handleSaveFilter = (name: string) => {
    const newFilter: SavedFilter = {
      id: Date.now().toString(),
      name,
      config: { ...filters }
    };
    setSavedFilters([...savedFilters, newFilter]);
  };

  const handleLoadFilter = (filter: SavedFilter) => {
    setFilters(filter.config);
  };

  const handleResetFilters = () => {
    setFilters(DEFAULT_FILTER);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-3 mb-8">
          <ShieldAlert className="w-8 h-8 text-indigo-600" />
          <h1 className="text-2xl font-bold text-gray-900">Content Moderation Dashboard</h1>
        </div>

        <FilterBar
          filters={filters}
          savedFilters={savedFilters}
          onFilterChange={setFilters}
          onSaveFilter={handleSaveFilter}
          onLoadFilter={handleLoadFilter}
          onResetFilters={handleResetFilters}
        />

        <QueryTable queries={filteredAndSortedQueries} />
      </div>
    </div>
  );
}

export default App;