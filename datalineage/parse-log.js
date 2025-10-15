#!/usr/bin/env node

/**
 * Log Parser CLI Tool
 * Converts tool logs to lineage JSON
 * 
 * Usage:
 *   node parse-log.js <log-file> [tool-name] [output-file]
 * 
 * Examples:
 *   node parse-log.js airflow.log airflow lineage.json
 *   node parse-log.js dbt.log dbt
 *   node parse-log.js spark.log
 */

import fs from 'fs';
import path from 'path';
import { parseLog, getSupportedTools } from './parsers/index.js';

// Parse command line arguments
const args = process.argv.slice(2);

if (args.length === 0 || args[0] === '--help' || args[0] === '-h') {
  showHelp();
  process.exit(0);
}

if (args[0] === '--list-tools') {
  console.log('Supported tools:');
  getSupportedTools().forEach(tool => console.log(`  - ${tool}`));
  process.exit(0);
}

const logFile = args[0];
const toolName = args[1] || null; // Auto-detect if not provided
const outputFile = args[2] || 'lineage.json';

// Validate input file
if (!fs.existsSync(logFile)) {
  console.error(`Error: Log file not found: ${logFile}`);
  process.exit(1);
}

try {
  console.log(`Reading log file: ${logFile}`);
  const logContent = fs.readFileSync(logFile, 'utf8');
  
  console.log(`Parsing with ${toolName || 'auto-detected'} parser...`);
  const lineageJSON = parseLog(logContent, toolName);
  
  console.log(`Writing lineage to: ${outputFile}`);
  fs.writeFileSync(outputFile, JSON.stringify(lineageJSON, null, 2));
  
  console.log('✅ Success!');
  console.log(`   Nodes: ${lineageJSON.levels[0].nodes.length}`);
  console.log(`   Edges: ${lineageJSON.levels[0].edges.length}`);
  console.log(`   Output: ${outputFile}`);
  
} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}

function showHelp() {
  console.log(`
Log Parser CLI Tool
===================

Convert tool logs to lineage JSON format.

Usage:
  node parse-log.js <log-file> [tool-name] [output-file]

Arguments:
  log-file      Path to the log file to parse (required)
  tool-name     Tool name: airflow, dbt, spark (optional, auto-detected)
  output-file   Output JSON file path (default: lineage.json)

Options:
  --help, -h        Show this help message
  --list-tools      List all supported tools

Examples:
  # Parse Airflow log with auto-detection
  node parse-log.js logs/airflow.log

  # Parse dbt log and specify output file
  node parse-log.js logs/dbt.log dbt output/dbt-lineage.json

  # Parse Spark log
  node parse-log.js logs/spark.log spark

Supported Tools:
  ${getSupportedTools().join(', ')}

For more information, see log-templates/README.md
  `);
}
