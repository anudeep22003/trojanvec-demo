export interface FileDetails {
  name: string;
  size: number;
  pageCount: number;
  status: 'idle' | 'processing' | 'completed' | 'error';
}

export interface RiskConfig {
  id: string;
  category: string;
  severity: 'High' | 'Medium' | 'Low';
  isAutoExtracted: boolean;
}

export interface LatencySettings {
  input: number;
  output: number;
}


export type Severity = 'Critical' | 'High' | 'Medium' | 'Low' | 'Info';

export type ContentCategory = 'Security' | 'Performance' | 'Accessibility' | 'Best Practices' | 'SEO' | 'UI/UX' | 'Documentation' | 'Code Quality';

export type TimeRange = '24h' | '7d' | '30d' | 'custom';

export type SortOption = 'most_recent' | 'severity_high_low' | 'severity_low_high';

export interface FilterConfig {
  timeRange: TimeRange;
  startDate?: Date;
  endDate?: Date;
  severities: Severity[];
  categories: ContentCategory[];
  sortBy: SortOption;
}

export interface SavedFilter {
  id: string;
  name: string;
  config: FilterConfig;
}

export interface Query {
  id: string;
  timestamp: string;
  severity: Severity;
  query: string;
  category: ContentCategory;
  latency: number;
}