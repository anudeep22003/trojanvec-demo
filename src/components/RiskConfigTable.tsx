import React from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import type { RiskConfig } from '../types';

interface RiskConfigTableProps {
  configs: RiskConfig[];
  isAutoExtracted?: boolean;
  onAddConfig?: () => void;
  onEditConfig?: (config: RiskConfig) => void;
  onDeleteConfig?: (id: string) => void;
}

export function RiskConfigTable({
  configs,
  isAutoExtracted = false,
  onAddConfig,
  onEditConfig,
  onDeleteConfig,
}: RiskConfigTableProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h3 className="text-lg font-medium">
          {isAutoExtracted ? 'Auto-Extracted Configurations' : 'Manual Configurations'}
        </h3>
        {!isAutoExtracted && onAddConfig && (
          <button
            onClick={onAddConfig}
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add New
          </button>
        )}
      </div>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Risk Category
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Severity Level
            </th>
            {!isAutoExtracted && (
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {configs.map((config) => (
            <tr key={config.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {config.category}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  config.severity === 'High' ? 'bg-red-100 text-red-800' :
                  config.severity === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {config.severity}
                </span>
              </td>
              {!isAutoExtracted && (
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => onEditConfig?.(config)}
                    className="text-blue-600 hover:text-blue-900 mr-3"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDeleteConfig?.(config.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              )}
            </tr>
          ))}
          {configs.length === 0 && (
            <tr>
              <td
                colSpan={!isAutoExtracted ? 3 : 2}
                className="px-6 py-4 text-sm text-gray-500 text-center"
              >
                No configurations found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}