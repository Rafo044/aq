"""
Universal Lineage Logger
Uses loguru to write lineage information to a standard log file
"""

from loguru import logger
import json
from typing import Optional, Dict, Any
from enum import Enum


class EdgeType(Enum):
    """Edge types for different relationship kinds"""
    DATA_FLOW = "data_flow"      # Data flows from source to target
    DEPENDENCY = "dependency"     # Target depends on source
    TRIGGER = "trigger"           # Source triggers target
    REFERENCE = "reference"       # Target references source


class LineageLogger:
    """Logger for data lineage tracking"""
    
    def __init__(self, log_file: str = "lineage.log"):
        """
        Initialize lineage logger
        
        Args:
            log_file: Path to log file
        """
        self.log_file = log_file
        
        # Configure loguru
        logger.remove()  # Remove default handler
        logger.add(
            log_file,
            format="{message}",
            level="INFO",
            rotation="100 MB",
            retention="30 days"
        )
        
        # Also log to console for debugging
        logger.add(
            lambda msg: print(msg),
            format="<green>{time:YYYY-MM-DD HH:mm:ss}</green> | {message}",
            level="INFO"
        )
    
    def log_lineage(
        self,
        source: str,
        target: str,
        tool: str,
        process: str,
        edge_type: EdgeType = EdgeType.DATA_FLOW,
        metadata: Optional[Dict[str, Any]] = None
    ):
        """
        Log a lineage relationship
        
        Args:
            source: Source node name
            target: Target node name
            tool: Tool/technology name (PostgreSQL, Python, dbt, etc.)
            process: Description of what this step does
            edge_type: Type of relationship (default: data_flow)
            metadata: Optional additional metadata
        """
        msg = (
            f"[LINEAGE] "
            f"source: {source} | "
            f"target: {target} | "
            f"tool: {tool} | "
            f"process: {process} | "
            f"edge_type: {edge_type.value}"
        )
        
        if metadata:
            msg += f" | metadata: {json.dumps(metadata)}"
        
        logger.info(msg)
    
    def log_info(self, message: str):
        """Log informational message"""
        logger.info(message)
    
    def log_error(self, message: str):
        """Log error message"""
        logger.error(message)


# Example usage
if __name__ == "__main__":
    # Initialize logger
    lineage = LineageLogger("lineage.log")
    
    # Example 1: ETL Pipeline
    lineage.log_info("Starting ETL pipeline")
    
    lineage.log_lineage(
        source="postgres_customers",
        target="extract_customers",
        tool="Python",
        process="Extract from PostgreSQL",
        edge_type=EdgeType.DATA_FLOW,
        metadata={"rows": 10000, "user": "etl_user"}
    )
    
    lineage.log_lineage(
        source="extract_customers",
        target="transform_customers",
        tool="Python",
        process="Clean & Deduplicate",
        edge_type=EdgeType.DATA_FLOW
    )
    
    lineage.log_lineage(
        source="transform_customers",
        target="snowflake_customers",
        tool="Snowflake",
        process="Load to Warehouse",
        edge_type=EdgeType.DATA_FLOW
    )
    
    lineage.log_info("ETL pipeline completed")
    
    # Example 2: dbt Models
    lineage.log_info("Running dbt models")
    
    lineage.log_lineage(
        source="raw_customers",
        target="stg_customers",
        tool="dbt",
        process="Staging Model",
        edge_type=EdgeType.DEPENDENCY
    )
    
    lineage.log_lineage(
        source="stg_customers",
        target="fct_customer_metrics",
        tool="dbt",
        process="Fact Table",
        edge_type=EdgeType.DEPENDENCY
    )
    
    lineage.log_info("dbt models completed")
    
    # Example 3: Spark Job
    lineage.log_info("Starting Spark job")
    
    lineage.log_lineage(
        source="hdfs_raw_events",
        target="filter_events",
        tool="Spark",
        process="Filter Invalid Records",
        edge_type=EdgeType.DATA_FLOW
    )
    
    lineage.log_lineage(
        source="filter_events",
        target="aggregate_events",
        tool="Spark",
        process="GroupBy & Aggregate",
        edge_type=EdgeType.DATA_FLOW
    )
    
    lineage.log_info("Spark job completed")
    
    print(f"\n✅ Lineage logged to {lineage.log_file}")
