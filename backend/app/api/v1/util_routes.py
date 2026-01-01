from fastapi import APIRouter, HTTPException
import os
from core.config import settings
from pathlib import Path
import logging

from pydantic import BaseModel

router = APIRouter()

logger = logging.getLogger(__name__)

class ChangeCWDRequest(BaseModel):
    path: str

@router.get('/getcwd')
def get_current_folder():
    return {'dir': settings.CURRENT_DIR}
    
@router.post('/change_cwd')
def change_dir(new_dir: ChangeCWDRequest):
    normalized_dir = Path(new_dir.path).resolve()
    if os.path.isdir(normalized_dir):
        settings.CURRENT_DIR = normalized_dir
        return {'message': f'Changed to {normalized_dir}'}
    else:
        return HTTPException(f"{normalized_dir} does not exist", 500) 
    