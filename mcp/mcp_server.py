from fastmcp import FastMCP
from typing import Dict, List, Any
from dotenv import load_dotenv
import os

openaq = FastMCP("openaq")

load_dotenv()

# =============================================================================================================
#                                 PERMISSIONS CHECK
# =============================================================================================================


@openaq.tool
def permission_check(permission: str) -> Dict[str, Any]:
    """
    Its main purpose is to check whether the
    PERMISSION section in the .env file is True or False:
        PERMISSION_DOCKER_CONTROL
        PERMISSION_DOCKER_STATS
        PERMISSION_POSTGRES_QUERY
        PERMISSION_POSTGRES_LOG
        PERMISSION_POSTGRES_BACKUP
        PERMISSION_REQUESTS

    Returns:
        A dictionary containing the permission status.
    """

    if os.getenv(permission, "false").lower() == "true":
        return {"status": "success", "message": "Permission granted"}
    else:
        return {"status": "error", "message": f"Permission denied for {permission}"}



# =============================================================================================================
#                                                    TOOLS
# =============================================================================================================



def all_test_run():













if __name__ == "__main__":
    openaq.run(transport="sse")
