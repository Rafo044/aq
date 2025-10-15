import React from 'react';
import { Handle, Position } from 'reactflow';
import { 
  Database, 
  Workflow, 
  FileOutput, 
  Code2, 
  Table, 
  Cloud, 
  Server,
  GitBranch,
  Zap,
  Package
} from 'lucide-react';

const CustomNode = ({ data, type }) => {
  // Get icon based on tool name
  const getIconByTool = (toolName) => {
    if (!toolName) return null;
    
    const tool = toolName.toLowerCase();
    
    // Programming languages
    if (tool.includes('python')) return <Code2 className="w-5 h-5 text-blue-400" />;
    if (tool.includes('java')) return <Code2 className="w-5 h-5 text-orange-400" />;
    if (tool.includes('javascript') || tool.includes('node')) return <Code2 className="w-5 h-5 text-yellow-400" />;
    
    // Databases
    if (tool.includes('postgres') || tool.includes('mysql') || tool.includes('oracle')) 
      return <Database className="w-5 h-5 text-blue-500" />;
    if (tool.includes('mongodb') || tool.includes('cassandra')) 
      return <Database className="w-5 h-5 text-green-500" />;
    
    // Cloud/Data Warehouses
    if (tool.includes('snowflake')) return <Cloud className="w-5 h-5 text-cyan-300" />;
    if (tool.includes('bigquery')) return <Cloud className="w-5 h-5 text-blue-300" />;
    if (tool.includes('redshift')) return <Cloud className="w-5 h-5 text-red-400" />;
    
    // ETL/Processing
    if (tool.includes('airflow')) return <GitBranch className="w-5 h-5 text-teal-400" />;
    if (tool.includes('spark')) return <Zap className="w-5 h-5 text-orange-400" />;
    if (tool.includes('dbt')) return <Package className="w-5 h-5 text-orange-500" />;
    
    // SQL
    if (tool.includes('sql')) return <Table className="w-5 h-5 text-purple-400" />;
    
    // Default based on node type
    if (type === 'input') return <Database className="w-5 h-5 text-cyan-400" />;
    if (type === 'output') return <FileOutput className="w-5 h-5 text-magenta-400" />;
    return <Workflow className="w-5 h-5 text-purple-400" />;
  };
  
  const getIcon = () => {
    return getIconByTool(data?.tool);
  };

  return (
    <div className="custom-node">
      {/* Node content */}
      <div className="node-content">
        {/* Icon and Tool Name */}
        <div className="flex items-center justify-center gap-2 mb-2">
          {getIcon()}
          {data?.tool && (
            <span className="text-cyan-400 text-xs font-bold uppercase tracking-wide">
              {data.tool}
            </span>
          )}
        </div>
        
        {/* Label */}
        <div className="text-white font-semibold text-sm mb-1">
          {data?.label || 'Node'}
        </div>
        
        {/* Process/Action */}
        {data?.process && (
          <div className="text-gray-400 text-xs italic mb-1">
            {data.process}
          </div>
        )}
        
        {/* Description if exists */}
        {data?.description && (
          <div className="text-gray-500 text-xs mt-1 max-w-[180px] leading-tight">
            {data.description}
          </div>
        )}
      </div>
      
      {/* Handles for connections */}
      <Handle
        type="target"
        position={Position.Left}
        className="handle-custom"
        style={{ background: '#00FFFF', border: '2px solid #0D0D0D' }}
      />
      <Handle
        type="source"
        position={Position.Right}
        className="handle-custom"
        style={{ background: '#00FFFF', border: '2px solid #0D0D0D' }}
      />
    </div>
  );
};

export default CustomNode;
