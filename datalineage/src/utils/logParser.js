/**
 * Browser-compatible Log Parser
 * Parses unified lineage log format directly in the browser
 */

/**
 * Parse unified lineage log content
 * Format: [LINEAGE] source: <name> | target: <name> | tool: <tool> | process: <process> | edge_type: <type>
 */
export function parseLogToLineage(logContent) {
  const lines = logContent.split('\n');
  const lineageEntries = [];

  // Extract lineage entries
  for (const line of lines) {
    const match = line.match(/\[LINEAGE\]\s+(.+)/);
    if (match) {
      const entry = parseLineageEntry(match[1]);
      if (entry) {
        lineageEntries.push(entry);
      }
    }
  }

  if (lineageEntries.length === 0) {
    throw new Error('No lineage entries found in log file');
  }

  // Extract edge_type for level name (use first entry's edge_type)
  const edgeType = lineageEntries[0]?.edge_type || 'data_flow';
  const levelName = formatEdgeTypeName(edgeType);

  // Build graph from entries
  const nodeMap = new Map(); // name -> node info
  
  // First pass: collect all unique nodes
  lineageEntries.forEach(entry => {
    if (!nodeMap.has(entry.source)) {
      nodeMap.set(entry.source, {
        name: entry.source,
        tools: new Set([entry.tool]),
        processes: new Set(),
        incoming: 0,
        outgoing: 0
      });
    }
    
    if (!nodeMap.has(entry.target)) {
      nodeMap.set(entry.target, {
        name: entry.target,
        tools: new Set(),
        processes: new Set([entry.process]),
        incoming: 0,
        outgoing: 0
      });
    }

    // Update node info
    const targetNode = nodeMap.get(entry.target);
    targetNode.tools.add(entry.tool);
    targetNode.processes.add(entry.process);
    
    // Track edges
    nodeMap.get(entry.source).outgoing++;
    nodeMap.get(entry.target).incoming++;
  });

  // Second pass: calculate layers and create nodes
  const layers = calculateLayers(lineageEntries, nodeMap);
  const nodes = [];
  const edges = [];
  
  layers.forEach((layerNodes, layerIndex) => {
    let yPosition = 100;
    const layerX = 100 + (layerIndex * 350); // Increased spacing for better animation visibility
    
    layerNodes.forEach(nodeName => {
      const nodeInfo = nodeMap.get(nodeName);
      const nodeType = determineNodeType(nodeInfo);
      const tool = Array.from(nodeInfo.tools)[0] || 'Unknown';
      const process = Array.from(nodeInfo.processes)[0] || 'Process';
      
      nodes.push({
        id: `node-${nodeName}`,
        type: nodeType,
        position: { x: layerX, y: yPosition },
        data: {
          label: nodeName,
          tool: tool,
          process: process,
          description: generateDescription(nodeInfo),
          metadata: {
            tools: Array.from(nodeInfo.tools),
            processes: Array.from(nodeInfo.processes)
          }
        }
      });
      
      yPosition += 150;
    });
  });

  // Third pass: create edges
  const edgeSet = new Set(); // Track unique edges
  lineageEntries.forEach((entry, index) => {
    const edgeId = `${entry.source}->${entry.target}`;
    if (!edgeSet.has(edgeId)) {
      edgeSet.add(edgeId);
      const edgeType = entry.edge_type || 'data_flow';
      const animated = true; // Always animate for visibility
      
      edges.push({
        id: `edge-${index}`,
        source: `node-${entry.source}`,
        target: `node-${entry.target}`,
        animated: animated,
        type: 'default',
        style: {
          stroke: 'url(#edge-gradient)',
          strokeWidth: 3
        },
        markerEnd: {
          type: 'arrowclosed',
          color: '#00FFFF'
        }
      });
    }
  });

  // Return lineage JSON format
  return {
    levels: [
      {
        id: 'level-parsed',
        name: levelName,
        nodes: nodes,
        edges: edges
      }
    ]
  };
}

/**
 * Format edge_type name for display
 */
function formatEdgeTypeName(edgeType) {
  if (!edgeType) return 'Data Lineage';
  
  // Convert snake_case to Title Case
  return edgeType
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Parse a single lineage entry
 */
function parseLineageEntry(entryString) {
  const fields = {};
  
  // Split by | and parse key-value pairs
  const parts = entryString.split('|').map(p => p.trim());
  
  for (const part of parts) {
    const colonIndex = part.indexOf(':');
    if (colonIndex > 0) {
      const key = part.substring(0, colonIndex).trim();
      const value = part.substring(colonIndex + 1).trim();
      fields[key] = value;
    }
  }

  // Validate required fields
  if (!fields.source || !fields.target || !fields.tool || !fields.process) {
    return null;
  }

  return {
    source: fields.source,
    target: fields.target,
    tool: fields.tool,
    process: fields.process,
    edge_type: fields.edge_type || 'data_flow',
    metadata: fields.metadata ? JSON.parse(fields.metadata) : {}
  };
}

/**
 * Calculate node layers for left-to-right layout
 */
function calculateLayers(entries, nodeMap) {
  const layers = [];
  const visited = new Set();

  // Find root nodes (no incoming edges)
  const roots = [];
  for (const [name, info] of nodeMap.entries()) {
    if (info.incoming === 0) {
      roots.push(name);
    }
  }

  // BFS to assign layers
  let currentLayer = roots;
  let layerIndex = 0;

  while (currentLayer.length > 0) {
    layers[layerIndex] = currentLayer;
    currentLayer.forEach(node => {
      visited.add(node);
    });

    // Find next layer
    const nextLayer = new Set();
    entries.forEach(entry => {
      if (visited.has(entry.source) && !visited.has(entry.target)) {
        nextLayer.add(entry.target);
      }
    });

    currentLayer = Array.from(nextLayer);
    layerIndex++;
  }

  // Add any remaining nodes (cycles or disconnected)
  for (const [name] of nodeMap.entries()) {
    if (!visited.has(name)) {
      if (!layers[layerIndex]) {
        layers[layerIndex] = [];
      }
      layers[layerIndex].push(name);
    }
  }

  return layers;
}

/**
 * Determine node type based on connections
 */
function determineNodeType(nodeInfo) {
  if (nodeInfo.incoming === 0) {
    return 'input';
  } else if (nodeInfo.outgoing === 0) {
    return 'output';
  } else {
    return 'default';
  }
}

/**
 * Generate node description
 */
function generateDescription(nodeInfo) {
  const tools = Array.from(nodeInfo.tools);
  const processes = Array.from(nodeInfo.processes);
  
  if (processes.length > 0) {
    return processes.join(', ');
  }
  
  return `Tools: ${tools.join(', ')}`;
}
