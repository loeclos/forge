from fastapi import APIRouter, HTTPException
import os
import logging

router = APIRouter()

logger = logging.getLogger(__name__)

@router.get('/getcwd')
def get_current_folder():
    try:
        current_dir = os.getcwd()
        logger.info(f"Current working directory retrieved: {current_dir}")
        return {'dir': current_dir}
    except Exception as e:
        logger.error(f"Failed to retrieve current directory. Error: {e}")
        raise HTTPException(status_code=500, detail=f'Failed to retrieve current directory. Error: {e}')