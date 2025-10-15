/**
 * Parser Registry
 * Universal parser for unified lineage format
 */
import UniversalParser from './UniversalParser.js';

const PARSERS = {
  universal: UniversalParser,
  lineage: UniversalParser, // Alias
};

/**
 * Get parser instance by tool name
 * @param {string} toolName - Name of the tool (airflow, dbt, spark, etc.)
 * @returns {BaseParser} - Parser instance
 */
export function getParser(toolName) {
  const ParserClass = PARSERS[toolName.toLowerCase()];
  if (!ParserClass) {
    throw new Error(`No parser found for tool: ${toolName}`);
  }
  return new ParserClass();
}

/**
 * Get list of supported tools
 * @returns {Array<string>} - List of tool names
 */
export function getSupportedTools() {
  return Object.keys(PARSERS);
}

/**
 * Parse log file content with automatic tool detection
 * @param {string} logContent - Raw log content
 * @param {string} toolName - Tool name (optional, will auto-detect if not provided)
 * @returns {Object} - Lineage JSON
 */
export function parseLog(logContent, toolName = null) {
  // Auto-detect tool if not specified
  if (!toolName) {
    toolName = detectTool(logContent);
  }

  const parser = getParser(toolName);
  return parser.parse(logContent);
}

/**
 * Auto-detect tool from log content
 * @param {string} logContent - Raw log content
 * @returns {string} - Detected tool name
 */
function detectTool(logContent) {
  // Check for unified lineage format
  if (logContent.includes('[LINEAGE]')) {
    return 'universal';
  }
  
  // Default to universal parser
  return 'universal';
}

export default {
  getParser,
  getSupportedTools,
  parseLog
};
