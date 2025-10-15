from loguru import logger
import os
from pathlib import Path

current_dir = Path(os.getcwd())

log_dir = current_dir / "logs"
log_dir.mkdir(parents=True, exist_ok=True)


logger.add(
    os.path.join(log_dir, "lineage.log"),
    rotation="10 MB",
    retention="14 days",
    format="{time:YYYY-MM-DD HH:mm:ss} | {level} | {message}",
    enqueue=True,
)

logger.level("LINEAGE", no=25, color="<cyan><bold>")


def log_start(process_name: str):
    logger.info(f"Starting {process_name}")


def log_success(process_name: str):
    logger.success(f"{process_name} completed successfully")


def log_error(process_name: str, error: Exception):
    logger.error(f"{process_name} failed: {error}")


def log_lineage(source, target, tool, process, edge_type="data_flow"):
    msg = (
        f"[LINEAGE] source: {source} | target: {target} | "
        f"tool: {tool} | process: {process} | edge_type: {edge_type}"
    )
    logger.log("LINEAGE", msg)
