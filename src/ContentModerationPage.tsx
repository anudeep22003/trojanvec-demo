import React, { useState } from 'react';
import { Settings } from 'lucide-react';
import { FileUpload } from './components/FileUpload';
import { RiskConfigTable } from './components/RiskConfigTable';
import { LatencyControl } from './components/LatencyControl';
import { ConfigModal } from './components/ConfigModal';
import type { FileDetails, RiskConfig } from './types';

interface LatencySettings {
  input: {
    min: number;
    max: number;
  };
  output: {
    min: number;
    max: number;
  };
}

function ContentModerationPage() {
  const [fileDetails, setFileDetails] = useState<FileDetails | null>({
    name: 'sample-document.pdf',
    size: 2500000, // 2.5MB
    pageCount: 15,
    status: 'completed',
  });

  const [autoConfigs, setAutoConfigs] = useState<RiskConfig[]>([
    { id: '1', category: 'Hate Speech', severity: 'High', isAutoExtracted: true },
    { id: '2', category: 'Violence', severity: 'Medium', isAutoExtracted: true },
    { id: '3', category: 'Adult Content', severity: 'High', isAutoExtracted: true },
    { id: '4', category: 'Harassment', severity: 'Medium', isAutoExtracted: true },
  ]);

  const [manualConfigs, setManualConfigs] = useState<RiskConfig[]>([
    { id: '5', category: 'Misinformation', severity: 'High', isAutoExtracted: false },
    { id: '6', category: 'Spam', severity: 'Low', isAutoExtracted: false },
  ]);

  const [latencySettings, setLatencySettings] = useState<LatencySettings>({
    input: { min: 30, max: 1000 },
    output: { min: 30, max: 1000 }
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingConfig, setEditingConfig] = useState<RiskConfig | undefined>();

  const handleFileUpload = async (file: File) => {
    setFileDetails({
      name: file.name,
      size: file.size,
      pageCount: 0,
      status: 'processing',
    });

    // Simulate PDF processing
    setTimeout(() => {
      setFileDetails(prev => prev ? { ...prev, status: 'completed', pageCount: 5 } : null);
      setAutoConfigs([
        { id: '1', category: 'Hate Speech', severity: 'High', isAutoExtracted: true },
        { id: '2', category: 'Violence', severity: 'Medium', isAutoExtracted: true },
      ]);
    }, 2000);
  };

  const handleAddConfig = () => {
    setEditingConfig(undefined);
    setIsModalOpen(true);
  };

  const handleEditConfig = (config: RiskConfig) => {
    setEditingConfig(config);
    setIsModalOpen(true);
  };

  const handleSaveConfig = (config: Omit<RiskConfig, 'id' | 'isAutoExtracted'>) => {
    if (editingConfig) {
      setManualConfigs(prev =>
        prev.map(c =>
          c.id === editingConfig.id
            ? { ...c, ...config }
            : c
        )
      );
    } else {
      setManualConfigs(prev => [
        ...prev,
        {
          id: Math.random().toString(36).substr(2, 9),
          ...config,
          isAutoExtracted: false,
        },
      ]);
    }
  };

  const handleDeleteConfig = (id: string) => {
    setManualConfigs(prev => prev.filter(c => c.id !== id));
  };

  const handleReset = () => {
    setFileDetails(null);
    setAutoConfigs([]);
    setManualConfigs([]);
    setLatencySettings({
      input: { min: 30, max: 1000 },
      output: { min: 30, max: 1000 }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center">
            <Settings className="w-8 h-8 text-blue-600 mr-3" />
            <h1 className="text-2xl font-bold text-gray-900">
              Content Moderation Configurator
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="space-y-8">
          <section>
            <h2 className="text-lg font-medium text-gray-900 mb-4">Document Upload</h2>
            <FileUpload
              fileDetails={fileDetails}
              onFileUpload={handleFileUpload}
            />
          </section>

          <section>
            <h2 className="text-lg font-medium text-gray-900 mb-4">Risk Configurations</h2>
            <div className="space-y-4">
              <RiskConfigTable
                configs={autoConfigs}
                isAutoExtracted
              />
              <RiskConfigTable
                configs={manualConfigs}
                onAddConfig={handleAddConfig}
                onEditConfig={handleEditConfig}
                onDeleteConfig={handleDeleteConfig}
              />
            </div>
          </section>

          <section>
            <h2 className="text-lg font-medium text-gray-900 mb-4">Latency Controls</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <LatencyControl
                label="Input Guardrail Latency"
                minValue={latencySettings.input.min}
                maxValue={latencySettings.input.max}
                onChange={(min, max) =>
                  setLatencySettings(prev => ({
                    ...prev,
                    input: { min, max }
                  }))
                }
              />
              <LatencyControl
                label="Output Guardrail Latency"
                minValue={latencySettings.output.min}
                maxValue={latencySettings.output.max}
                onChange={(min, max) =>
                  setLatencySettings(prev => ({
                    ...prev,
                    output: { min, max }
                  }))
                }
              />
            </div>
          </section>

          <section className="flex justify-end space-x-4">
            <button
              onClick={handleReset}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Reset
            </button>
            <button
              onClick={() => {
                // Handle configuration apply
                console.log({
                  autoConfigs,
                  manualConfigs,
                  latencySettings,
                });
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
            >
              Apply Configuration
            </button>
          </section>
        </div>
      </main>

      <ConfigModal
        isOpen={isModalOpen}
        config={editingConfig}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveConfig}
      />
    </div>
  );
}

export default ContentModerationPage;