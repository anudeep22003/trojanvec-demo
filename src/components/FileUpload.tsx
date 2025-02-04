import React, { useCallback } from 'react';
import { FileUp, File as FileIcon, AlertCircle } from 'lucide-react';
import type { FileDetails } from '../types';

interface FileUploadProps {
  fileDetails: FileDetails | null;
  onFileUpload: (file: File) => void;
}

export function FileUpload({ fileDetails, onFileUpload }: FileUploadProps) {
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file?.type === 'application/pdf') {
      onFileUpload(file);
    }
  }, [onFileUpload]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileUpload(file);
    }
  }, [onFileUpload]);

  if (fileDetails) {
    return (
      <div className="p-6 border-2 border-gray-200 rounded-lg bg-white">
        <div className="flex items-center space-x-4">
          <FileIcon className="w-8 h-8 text-blue-500" />
          <div className="flex-1">
            <h3 className="font-medium">{fileDetails.name}</h3>
            <div className="text-sm text-gray-500">
              <span>{(fileDetails.size / 1024 / 1024).toFixed(2)} MB</span>
              <span className="mx-2">•</span>
              <span>{fileDetails.pageCount} pages</span>
            </div>
          </div>
          <div className={`px-3 py-1 rounded-full text-sm ${
            fileDetails.status === 'completed' ? 'bg-green-100 text-green-800' :
            fileDetails.status === 'processing' ? 'bg-blue-100 text-blue-800' :
            fileDetails.status === 'error' ? 'bg-red-100 text-red-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {fileDetails.status.charAt(0).toUpperCase() + fileDetails.status.slice(1)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-blue-500 transition-colors"
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
    >
      <FileUp className="mx-auto h-12 w-12 text-gray-400" />
      <div className="mt-4">
        <label className="cursor-pointer">
          <span className="mt-2 block text-sm font-medium text-gray-900">
            Drag and drop your PDF here, or{' '}
            <span className="text-blue-500 hover:text-blue-600">browse</span>
          </span>
          <input
            type="file"
            className="hidden"
            accept="application/pdf"
            onChange={handleFileInput}
          />
        </label>
      </div>
      <p className="mt-2 text-xs text-gray-500">PDF files only, up to 10MB</p>
    </div>
  );
}