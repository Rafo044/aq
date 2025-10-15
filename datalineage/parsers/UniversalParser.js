import BaseParser from './BaseParser.js';

/**
 * Universal Lineage Parser
 * Parses the unified lineage log format
 * Works with any tool - icon and behavior based on tool name
 */
class UniversalParser extends BaseParser {
  constructor() {
    super('Universal');
  }

  /**
   * Parse unified lineage log
   * Format: [LINEAGE] source: <name> | target: <name> | tool: <tool> | process: <process> | edge_type: <type>
   */
  parse(logContent) {
    this.reset();
    const lines = logContent.split('\n');
    const lineageEntries = [];

    // Extract lineage entries
    for (const line of lines) {
      const match = line.match(/\[LINEAGE\]\s+(.+)/);
      if (match) {
        const entry = this.parseLineageEntry(match[1]);
        if (entry) {
          lineageEntries.push(entry);
        }
      }
    }

    // Build graph from entries
    const nodeMap = new Map(); // name -> node info
    const nodePositions = new Map(); // name -> {x, y}
    
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

    // Second pass: determine node types and create nodes
    let xPosition = 100;
    const layers = this.calculateLayers(lineageEntries, nodeMap);
    
    layers.forEach((layerNodes, layerIndex) => {
      let yPosition = 100;
      const layerX = 100 + (layerIndex * 300);
      
      layerNodes.forEach(nodeName => {
        const nodeInfo = nodeMap.get(nodeName);
        const nodeType = this.determineNodeType(nodeInfo);
        const tool = Array.from(nodeInfo.tools)[0] || 'Unknown';
        const process = Array.from(nodeInfo.processes)[0] || 'Process';
        
        this.createNode(
          `node-${nodeName}`,
          nodeType,
          nodeName,
          tool,
          process,
          this.generateDescription(nodeInfo),
          { x: layerX, y: yPosition },
          {
            tools: Array.from(nodeInfo.tools),
            processes: Array.from(nodeInfo.processes)
          }
        );
        
        nodePositions.set(nodeName, { x: layerX, y: yPosition });
        yPosition += 150;
      });
    });

    // Third pass: create edges
    lineageEntries.forEach(entry => {
      const edgeType = entry.edge_type || 'data_flow';
      const animated = edgeType === 'data_flow';
      
      this.createEdge(
        `node-${entry.source}`,
        `node-${entry.target}`,
        animated
      );
    });

    return this.toLineageJSON('Universal Lineage');
  }

  /**
   * Parse a single lineage entry
   */
  parseLineageEntry(entryString) {
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
  calculateLayers(entries, nodeMap) {
    const layers = [];
    const visited = new Set();
    const nodeToLayer = new Map();

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
        nodeToLayer.set(node, layerIndex);
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
  determineNodeType(nodeInfo) {
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
  generateDescription(nodeInfo) {
    const tools = Array.from(nodeInfo.tools);
    const processes = Array.from(nodeInfo.processes);
    
    if (processes.length > 0) {
      return processes.join(', ');
    }
    
    return `Tools: ${tools.join(', ')}`;
  }
}

export default UniversalParser;
