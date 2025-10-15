import React, { useState, useCallback, useEffect, useRef } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Panel,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Layers, Info, AlertCircle, GitBranch } from 'lucide-react';
import LevelSelector from './components/LevelSelector';
import NodeDetailsPanel from './components/NodeDetailsPanel';
import CustomNode from './components/CustomNode';
import { parseLogToLineage } from './utils/logParser';
import fallbackData from './data/lineage.json';

const nodeTypes = {
  input: CustomNode,
  default: CustomNode,
  output: CustomNode,
};

function App() {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [selectedNode, setSelectedNode] = useState(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [lineageData, setLineageData] = useState(fallbackData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const reactFlowInstance = useRef(null);

  // Load and parse log file on mount
  useEffect(() => {
    async function loadLogFile() {
      try {
        setLoading(true);
        setError(null);
        
        // Try to fetch the log file
        const response = await fetch('/lineage.log');
        
        if (response.ok) {
          const logContent = await response.text();
          
          // Parse the log content
          const parsedData = parseLogToLineage(logContent);
          setLineageData(parsedData);
          console.log('✅ Log file parsed successfully');
          console.log('Parsed data:', parsedData);
          console.log('Nodes:', parsedData.levels[0]?.nodes?.length);
          console.log('Edges:', parsedData.levels[0]?.edges?.length);
        } else {
          // Log file not found, use fallback data
          console.log('ℹ️ Log file not found, using sample data');
          setLineageData(fallbackData);
        }
      } catch (err) {
        console.error('Error loading log file:', err);
        setError(err.message);
        // Use fallback data on error
        setLineageData(fallbackData);
      } finally {
        setLoading(false);
      }
    }

    loadLogFile();
  }, []);

  // Load data for the current level
  useEffect(() => {
    if (lineageData.levels && lineageData.levels[currentLevel]) {
      const level = lineageData.levels[currentLevel];
      // Ensure nodes have draggable property
      const nodesWithDraggable = (level.nodes || []).map(node => ({
        ...node,
        draggable: true,
      }));
      setNodes(nodesWithDraggable);
      setEdges(level.edges || []);
    }
  }, [currentLevel, lineageData, setNodes, setEdges]);

  // Fit view after nodes are rendered
  useEffect(() => {
    if (nodes.length > 0 && reactFlowInstance.current) {
      setTimeout(() => {
        reactFlowInstance.current.fitView({
          padding: 0.2,
          duration: 800,
          minZoom: 0.5,
          maxZoom: 1.5
        });
      }, 300);
    }
  }, [nodes]);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onNodeClick = useCallback((event, node) => {
    setSelectedNode(node);
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, []);

  return (
    <div className="w-full h-full flex flex-col" style={{ background: '#0D0D0D' }}>
      {/* Header */}
      <header className="px-6 py-4" style={{ background: '#1A1A1A', borderBottom: '1px solid #333' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <GitBranch className="w-8 h-8" style={{ color: '#00FFFF' }} />
            <div>
              <h1 className="text-2xl font-bold" style={{ color: '#FFFFFF' }}>Data Lineage</h1>
              <p className="text-sm" style={{ color: '#888' }}>
                Data Lineage Visualization
                {loading && ' • Loading...'}
                {!loading && error && ' • Using sample data'}
              </p>
            </div>
          </div>
          <LevelSelector
            levels={lineageData.levels}
            currentLevel={currentLevel}
            onLevelChange={setCurrentLevel}
          />
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          onPaneClick={onPaneClick}
          onInit={(instance) => {
            reactFlowInstance.current = instance;
          }}
          nodeTypes={nodeTypes}
          nodesDraggable={true}
          nodesConnectable={false}
          elementsSelectable={true}
        >
          <svg style={{ position: 'absolute', width: 0, height: 0 }}>
            <defs>
              <linearGradient id="edge-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style={{ stopColor: '#8B5CF6', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: '#00FFFF', stopOpacity: 1 }} />
              </linearGradient>
            </defs>
          </svg>
          <Controls />
          <MiniMap 
            nodeColor={() => '#FF00FF'}
            maskColor="rgba(13, 13, 13, 0.8)"
          />
          <Background variant="dots" gap={16} size={1} color="#2A2A2A" />
          
          <Panel position="top-center" className="px-4 py-2 rounded-lg" style={{ background: '#1A1A1A', border: '1px solid #333', boxShadow: '0 0 10px rgba(0, 255, 255, 0.3)' }}>
            <div className="flex items-center gap-2 text-sm">
              {error ? (
                <>
                  <AlertCircle className="w-4 h-4" style={{ color: '#FFA500' }} />
                  <span style={{ color: '#FFFFFF' }}>
                    Sample Data (place lineage.log in public/ to auto-parse)
                  </span>
                </>
              ) : (
                <>
                  <Info className="w-4 h-4" style={{ color: '#00FFFF' }} />
                  <span style={{ color: '#FFFFFF' }}>
                    {lineageData.levels[currentLevel]?.name || 'Data Lineage Graph'}
                  </span>
                </>
              )}
            </div>
          </Panel>
        </ReactFlow>

        {/* Node Details Panel */}
        {selectedNode && (
          <NodeDetailsPanel
            node={selectedNode}
            onClose={() => setSelectedNode(null)}
          />
        )}
      </div>
    </div>
  );
}

export default App;
