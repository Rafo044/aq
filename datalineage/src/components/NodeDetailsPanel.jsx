import React from 'react';
import { X, Database, FileText, GitBranch } from 'lucide-react';

function NodeDetailsPanel({ node, onClose }) {
  const getIcon = () => {
    switch (node.type) {
      case 'input':
        return <Database className="w-5 h-5" style={{ color: '#FF00FF' }} />;
      case 'output':
        return <FileText className="w-5 h-5" style={{ color: '#00FFFF' }} />;
      default:
        return <GitBranch className="w-5 h-5" style={{ color: '#8B5CF6' }} />;
    }
  };

  return (
    <div className="absolute top-4 right-4 w-80 rounded-lg z-10" style={{ background: '#1A1A1A', border: '1px solid #333', boxShadow: '0 0 20px rgba(0, 255, 255, 0.3)' }}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid #333' }}>
        <div className="flex items-center gap-2">
          {getIcon()}
          <h3 className="font-semibold" style={{ color: '#FFFFFF' }}>Node Details</h3>
        </div>
        <button
          onClick={onClose}
          className="transition-colors"
          style={{ color: '#888' }}
          onMouseEnter={(e) => e.target.style.color = '#00FFFF'}
          onMouseLeave={(e) => e.target.style.color = '#888'}
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Content */}
      <div className="px-4 py-3 space-y-3">
        <div>
          <label className="text-xs font-medium uppercase" style={{ color: '#888' }}>Label</label>
          <p className="text-sm mt-1" style={{ color: '#FFFFFF' }}>{node.data?.label || 'N/A'}</p>
        </div>

        {node.data?.description && (
          <div>
            <label className="text-xs font-medium uppercase" style={{ color: '#888' }}>Description</label>
            <p className="text-sm mt-1" style={{ color: '#CCC' }}>{node.data.description}</p>
          </div>
        )}

        <div>
          <label className="text-xs font-medium uppercase" style={{ color: '#888' }}>Type</label>
          <p className="text-sm mt-1 capitalize" style={{ color: '#FFFFFF' }}>{node.type || 'default'}</p>
        </div>

        <div>
          <label className="text-xs font-medium uppercase" style={{ color: '#888' }}>ID</label>
          <p className="text-sm mt-1 font-mono" style={{ color: '#00FFFF' }}>{node.id}</p>
        </div>

        {node.data?.metadata && (
          <div>
            <label className="text-xs font-medium uppercase" style={{ color: '#888' }}>Metadata</label>
            <div className="mt-1 rounded p-2" style={{ background: '#0D0D0D' }}>
              <pre className="text-xs overflow-auto" style={{ color: '#00FFFF' }}>
                {JSON.stringify(node.data.metadata, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default NodeDetailsPanel;
