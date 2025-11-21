from fastapi import APIRouter, HTTPException
import os
from app.core.config import settings
from pathlib import Path
import logging

router = APIRouter()

logger = logging.getLogger(__name__)

@router.get('/getcwd')
def get_current_folder():
    return {'dir': settings.CURRENT_DIR}
    
@router.post('/change_cwd/{dir}')
def change_dir(dir: str):
    normalized_dir = Path(dir).resolve()._str
    if os.path.isdir(normalized_dir):
        os.chdir(normalized_dir)
        return {'message': f'Changed to {normalized_dir}'}
    else:
        return HTTPException(f"{normalized_dir} does not exist", 500) 
    