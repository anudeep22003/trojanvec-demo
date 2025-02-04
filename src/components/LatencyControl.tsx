import React, { useState, useEffect, useRef } from 'react';
import { Clock } from 'lucide-react';

interface LatencyControlProps {
  label: string;
  minValue: number;
  maxValue: number;
  onChange: (min: number, max: number) => void;
}

const LATENCY_BOUNDS = {
  min: 30,    // 30ms
  max: 30000  // 30s
} as const;

export function LatencyControl({ label, minValue, maxValue, onChange }: LatencyControlProps) {
  const [range, setRange] = useState({ min: minValue, max: maxValue });
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setRange({ min: minValue, max: maxValue });
  }, [minValue, maxValue]);

  const convertToPercent = (value: number) => {
    return ((value - LATENCY_BOUNDS.min) / (LATENCY_BOUNDS.max - LATENCY_BOUNDS.min)) * 100;
  };

  const calculateValueFromMousePosition = (clientX: number) => {
    if (!sliderRef.current) return LATENCY_BOUNDS.min;
    
    const sliderBounds = sliderRef.current.getBoundingClientRect();
    const percentageAlongSlider = Math.max(0, Math.min(100, 
      ((clientX - sliderBounds.left) / sliderBounds.width) * 100
    ));
    
    return Math.round(
      ((percentageAlongSlider / 100) * (LATENCY_BOUNDS.max - LATENCY_BOUNDS.min)) + LATENCY_BOUNDS.min
    );
  };

  const createDragHandler = (isMinHandle: boolean) => (e: React.MouseEvent) => {
    e.preventDefault();

    const handleMouseMove = (e: MouseEvent) => {
      const newValue = calculateValueFromMousePosition(e.clientX);
      
      if (isMinHandle) {
        const boundedValue = Math.min(newValue, range.max);
        setRange(prev => ({ ...prev, min: boundedValue }));
        onChange(boundedValue, range.max);
      } else {
        const boundedValue = Math.max(newValue, range.min);
        setRange(prev => ({ ...prev, max: boundedValue }));
        onChange(range.min, boundedValue);
      }
    };

    const stopDragging = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', stopDragging);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', stopDragging);
  };

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <Clock className="w-5 h-5 text-gray-400 mr-2" />
          <label className="block text-sm font-medium text-gray-700">{label}</label>
        </div>
        <span className="text-lg font-semibold text-gray-700">
          {range.min}ms - {range.max}ms
        </span>
      </div>
      
      <div className="flex items-center space-x-4">
        <span className="text-xs text-gray-500">{LATENCY_BOUNDS.min}ms</span>
        <div className="flex-1 relative h-8" ref={sliderRef}>
          <SliderTrack
            minPercent={convertToPercent(range.min)}
            maxPercent={convertToPercent(range.max)}
          />
          <SliderHandle
            position={convertToPercent(range.min)}
            onDrag={createDragHandler(true)}
            zIndex={3}
          />
          <SliderHandle
            position={convertToPercent(range.max)}
            onDrag={createDragHandler(false)}
            zIndex={4}
          />
        </div>
        <span className="text-xs text-gray-500">{LATENCY_BOUNDS.max / 1000}s</span>
      </div>
    </div>
  );
}

interface SliderTrackProps {
  minPercent: number;
  maxPercent: number;
}

function SliderTrack({ minPercent, maxPercent }: SliderTrackProps) {
  return (
    <>
      <div className="absolute w-full h-2 top-3 bg-gray-200 rounded-lg" />
      <div 
        className="absolute h-2 top-3 bg-blue-500 rounded-lg" 
        style={{ 
          left: `${minPercent}%`,
          width: `${maxPercent - minPercent}%`
        }} 
      />
    </>
  );
}

interface SliderHandleProps {
  position: number;
  onDrag: (e: React.MouseEvent) => void;
  zIndex: number;
}

function SliderHandle({ position, onDrag, zIndex }: SliderHandleProps) {
  return (
    <div 
      className="absolute w-4 h-4 top-2 -ml-2 bg-white rounded-full border border-blue-500 shadow cursor-pointer"
      style={{ 
        left: `${position}%`,
        zIndex,
        touchAction: 'none'
      }}
      onMouseDown={onDrag}
    />
  );
}