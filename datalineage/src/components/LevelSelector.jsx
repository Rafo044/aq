import React from 'react';
import { ChevronDown } from 'lucide-react';

function LevelSelector({ levels, currentLevel, onLevelChange }) {
  return (
    <div className="relative">
      <select
        value={currentLevel}
        onChange={(e) => onLevelChange(Number(e.target.value))}
        className="appearance-none rounded-lg px-4 py-2 pr-10 text-sm font-medium focus:outline-none cursor-pointer"
        style={{
          background: '#1A1A1A',
          border: '1px solid #333',
          color: '#FFFFFF',
          boxShadow: '0 0 10px rgba(0, 255, 255, 0.3)'
        }}
      >
        {levels.map((level, index) => (
          <option key={level.id} value={index}>
            {level.name}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: '#00FFFF' }} />
    </div>
  );
}

export default LevelSelector;
