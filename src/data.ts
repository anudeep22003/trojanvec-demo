import { Query, SavedFilter, FilterConfig } from './types';

export const DEFAULT_FILTER: FilterConfig = {
  timeRange: '24h',
  severities: ['Critical', 'High', 'Medium', 'Low', 'Info'],
  categories: ['Security', 'Performance', 'Accessibility', 'Best Practices', 'SEO', 'UI/UX', 'Documentation', 'Code Quality'],
  sortBy: 'most_recent'
};

export const mockQueries: Query[] = [
  {
    id: '1',
    timestamp: '2024-02-04T10:15:30Z',
    severity: 'Critical',
    query: 'Security vulnerability detected in authentication system',
    category: 'Security',
    latency: 1250,
  },
  {
    id: '2',
    timestamp: '2024-02-04T10:16:45Z',
    severity: 'High',
    query: 'Main API endpoint experiencing high latency',
    category: 'Performance',
    latency: 850,
  },
  {
    id: '3',
    timestamp: '2024-02-04T10:18:20Z',
    severity: 'Medium',
    query: 'Missing alt tags on critical UI elements',
    category: 'Accessibility',
    latency: 450,
  },
  {
    id: '4',
    timestamp: '2024-02-04T10:20:15Z',
    severity: 'Low',
    query: 'Documentation needs update for new API endpoints',
    category: 'Documentation',
    latency: 350,
  },
];

export const mockSavedFilters: SavedFilter[] = [
  {
    id: '1',
    name: 'Security Issues',
    config: {
      timeRange: '24h',
      severities: ['Critical', 'High'],
      categories: ['Security'],
      sortBy: 'most_recent'
    }
  },
  {
    id: '2',
    name: 'Performance Monitor',
    config: {
      timeRange: '7d',
      severities: ['High', 'Medium'],
      categories: ['Performance'],
      sortBy: 'most_recent'
    }
  }
];