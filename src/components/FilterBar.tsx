import React, { useState, useRef, useEffect } from 'react';
import { Calendar, Filter, SortAsc, Save, RotateCcw, BookMarked, Check, ChevronDown } from 'lucide-react';
import { 
  FilterConfig, 
  TimeRange, 
  Severity, 
  ContentCategory, 
  SortOption,
  SavedFilter 
} from '../types';
import { DEFAULT_FILTER } from '../data';

interface FilterBarProps {
  filters: FilterConfig;
  savedFilters: SavedFilter[];
  onFilterChange: (filters: FilterConfig) => void;
  onSaveFilter: (name: string) => void;
  onLoadFilter: (filter: SavedFilter) => void;
  onResetFilters: () => void;
}

interface MultiSelectProps<T extends string> {
  options: { value: T; label: string }[];
  selected: T[];
  onChange: (selected: T[]) => void;
  label: string;
  icon: React.ReactNode;
}

function MultiSelect<T extends string>({ options, selected, onChange, label, icon }: MultiSelectProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleOption = (value: T) => {
    const newSelected = selected.includes(value)
      ? selected.filter(item => item !== value)
      : [...selected, value];
    onChange(newSelected);
  };

  const displayText = selected.length === 0
    ? 'None selected'
    : selected.length === options.length
    ? 'All selected'
    : `${selected.length} selected`;

  return (
    <div className="space-y-2" ref={dropdownRef}>
      <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
        {icon}
        {label}
      </label>
      <div className="relative">
        <button
          type="button"
          className="w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center justify-between"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span>{displayText}</span>
          <ChevronDown className="w-4 h-4 ml-2" />
        </button>
        
        {isOpen && (
          <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
            {options.map((option) => (
              <div
                key={option.value}
                className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => toggleOption(option.value)}
              >
                <div className="flex items-center flex-1">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    checked={selected.includes(option.value)}
                    onChange={() => {}}
                  />
                  <span className="ml-3 block truncate">{option.label}</span>
                </div>
                {selected.includes(option.value) && (
                  <Check className="w-4 h-4 text-indigo-600" />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function FilterBar({ 
  filters, 
  savedFilters, 
  onFilterChange, 
  onSaveFilter, 
  onLoadFilter,
  onResetFilters 
}: FilterBarProps) {
  const timeRanges: { value: TimeRange; label: string }[] = [
    { value: '24h', label: 'Last 24 hours' },
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: 'custom', label: 'Custom Range' },
  ];

  const severities: { value: Severity; label: string }[] = [
    { value: 'Critical', label: 'Critical' },
    { value: 'High', label: 'High' },
    { value: 'Medium', label: 'Medium' },
    { value: 'Low', label: 'Low' },
    { value: 'Info', label: 'Info' }
  ];

  const categories: { value: ContentCategory; label: string }[] = [
    { value: 'Security', label: 'Security' },
    { value: 'Performance', label: 'Performance' },
    { value: 'Accessibility', label: 'Accessibility' },
    { value: 'Best Practices', label: 'Best Practices' },
    { value: 'SEO', label: 'SEO' },
    { value: 'UI/UX', label: 'UI/UX' },
    { value: 'Documentation', label: 'Documentation' },
    { value: 'Code Quality', label: 'Code Quality' }
  ];

  const sortOptions: { value: SortOption; label: string }[] = [
    { value: 'most_recent', label: 'Most Recent' },
    { value: 'severity_high_low', label: 'Severity (High to Low)' },
    { value: 'severity_low_high', label: 'Severity (Low to High)' },
  ];

  const handleSaveFilter = () => {
    const name = prompt('Enter a name for this filter configuration:');
    if (name) {
      onSaveFilter(name);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm space-y-6">
      {/* Saved Filters */}
      <div className="border-b pb-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <BookMarked className="w-4 h-4" />
            Saved Filters
          </h3>
          <div className="space-x-2">
            <button
              onClick={handleSaveFilter}
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Save className="w-4 h-4 mr-1" />
              Save Current
            </button>
            <button
              onClick={onResetFilters}
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <RotateCcw className="w-4 h-4 mr-1" />
              Reset All
            </button>
          </div>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {savedFilters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => onLoadFilter(filter)}
              className="flex-shrink-0 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm font-medium hover:bg-indigo-100"
            >
              {filter.name}
            </button>
          ))}
        </div>
      </div>

      {/* Filter Controls */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Time Range Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Time Range
          </label>
          <select
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            value={filters.timeRange}
            onChange={(e) => onFilterChange({ ...filters, timeRange: e.target.value as TimeRange })}
          >
            {timeRanges.map((range) => (
              <option key={range.value} value={range.value}>
                {range.label}
              </option>
            ))}
          </select>
        </div>

        {/* Severity Filter */}
        <MultiSelect
          options={severities}
          selected={filters.severities}
          onChange={(selected) => onFilterChange({ ...filters, severities: selected })}
          label="Severity"
          icon={<Filter className="w-4 h-4" />}
        />

        {/* Category Filter */}
        <MultiSelect
          options={categories}
          selected={filters.categories}
          onChange={(selected) => onFilterChange({ ...filters, categories: selected })}
          label="Content Category"
          icon={<Filter className="w-4 h-4" />}
        />

        {/* Sort Control */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <SortAsc className="w-4 h-4" />
            Sort By
          </label>
          <select
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            value={filters.sortBy}
            onChange={(e) => onFilterChange({ ...filters, sortBy: e.target.value as SortOption })}
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}