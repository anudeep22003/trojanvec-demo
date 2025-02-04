import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Query } from '../types';

interface QueryTableProps {
  queries: Query[];
}

export function QueryTable({ queries }: QueryTableProps) {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const toggleRow = (id: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  const getSeverityColor = (severity: Query['severity']) => {
    switch (severity) {
      case 'Critical':
        return 'text-purple-600 bg-purple-50';
      case 'High':
        return 'text-red-600 bg-red-50';
      case 'Medium':
        return 'text-yellow-600 bg-yellow-50';
      case 'Low':
        return 'text-green-600 bg-green-50';
      case 'Info':
        return 'text-blue-600 bg-blue-50';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const formatLatency = (latency: number) => {
    return `${latency.toLocaleString()} ms`;
  };

  return (
    <div className="mt-4 bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Timestamp
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Severity
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Issue
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Latency
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {queries.map((query) => (
              <React.Fragment key={query.id}>
                <tr className={query.severity === 'Critical' ? 'bg-purple-50/30' : query.severity === 'High' ? 'bg-red-50/30' : ''}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatTimestamp(query.timestamp)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getSeverityColor(
                        query.severity
                      )}`}
                    >
                      {query.severity}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <div className="flex items-start gap-2">
                      <div className="flex-1">
                        <div
                          className={`${
                            expandedRows.has(query.id) ? '' : 'line-clamp-2'
                          } whitespace-pre-wrap`}
                        >
                          {query.query}
                        </div>
                      </div>
                      <button
                        onClick={() => toggleRow(query.id)}
                        className="flex-shrink-0 text-gray-400 hover:text-gray-500"
                      >
                        {expandedRows.has(query.id) ? (
                          <ChevronUp className="h-5 w-5" />
                        ) : (
                          <ChevronDown className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {query.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatLatency(query.latency)}
                  </td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}