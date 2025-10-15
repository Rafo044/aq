/**
 * Base Parser Class
 * All tool-specific parsers extend this class
 */
class BaseParser {
  constructor(toolName) {
    this.toolName = toolName;
    this.nodes = [];
    this.edges = [];
  }

  /**
   * Parse log file content
   * @param {string} logContent - Raw log file content
   * @returns {Object} - Lineage JSON structure
   */
  parse(logContent) {
    throw new Error('parse() must be implemented by subclass');
  }

  /**
   * Create a node in the lineage graph
   */
  createNode(id, type, label, tool, process, description, position, metadata = {}) {
    const node = {
      id,
      type,
      position,
      data: {
        label,
        tool,
        process,
        description,
        metadata
      }
    };
    this.nodes.push(node);
    return node;
  }

  /**
   * Create an edge between two nodes
   */
  createEdge(sourceId, targetId, animated = true) {
    const edge = {
      id: `${sourceId}-${targetId}`,
      source: sourceId,
      target: targetId,
      animated
    };
    this.edges.push(edge);
    return edge;
  }

  /**
   * Generate final lineage JSON
   */
  toLineageJSON(levelName) {
    return {
      levels: [
        {
          id: `level-${this.toolName.toLowerCase()}`,
          name: levelName || `${this.toolName} Lineage`,
          nodes: this.nodes,
          edges: this.edges
        }
      ]
    };
  }

  /**
   * Reset parser state
   */
  reset() {
    this.nodes = [];
    this.edges = [];
  }
}

export default BaseParser;
