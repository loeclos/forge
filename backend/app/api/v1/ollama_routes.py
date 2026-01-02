from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse

import ollama
from app.services.ollama_services import get_all_models
from pydantic import BaseModel
from app.core.config import settings
import json
import logging

logger = logging.getLogger(__name__)


router = APIRouter()

# Request models
class ChangeModelRequest(BaseModel):
    model_name: str

# Used to create a streaming response
def download_model(model_name: str):
    '''yields data for fastapi StreamingResponse
    
    Returns
    -------
    - `str`: SSE like structured string'''

    for progress in ollama.pull(model_name, stream=True):
        data = json.dumps({'completed': progress.completed, 'total': progress.total})
        logger.debug(f"Download progress for {model_name}: {data}")
        yield f'data: {data}\n\n'

@router.post('/download/{model_name}')
def download_new_model(model_name: str):
    '''Downloads a model (if exists) from ollama.com
    
    Returns
    -------
    - A `StreamingResponse` of the download activity.
    - A `HTTPException` if wanted model does not exist on ollama servers and/or when encountered an ollama `ConnectionError`'''

    try:
        logger.info(f'Downloading new model {model_name}.')
        return StreamingResponse(
        download_model(model_name),
        media_type='application/json'  
        )     
    except ConnectionError as e:
        logger.error(f'Failed to download {model_name}: Ollama not installed or not running.')
        return HTTPException(status_code=500, detail='Ollama either not installed or not running.')
    except ollama.ResponseError:
        logger.error(f'Failed to download {model_name}: Model does not exist.')
        return HTTPException(status_code=500, detail='The model you tried to download does not exist.')

@router.get('/all')
def get_models():
    '''This function will return all of the availble models.
    
    Returns
    -------
    - A list of models dicts. Example model dict: `{ 'name': 'some-model:3b', 'size': 10000000, 'param_size': 100000000 }`
    - `HTTPException` if ollama throws a ConnectionError.'''
    
    formatted_models_list = []
    models_list = []

    try:
        logger.info("Fetching all available models from Ollama.")
        models_list = get_all_models()
    except ConnectionError as e:
        logger.error("Failed to fetch models: Ollama not installed or not running.")
        return HTTPException(status_code=500, detail='Ollama either not installed or not running.')
    
    for model in models_list.models:
        logger.debug(f"Found model: {model.model}")
        formatted_models_list.append({'name': model.model, 'size': model.size, 'param_size': model.details.parameter_size})

    logger.info(f"Returning {len(formatted_models_list)} models.")
    return formatted_models_list

@router.get('/current')
def get_current_model():
    '''Gets the current model set in settings..

    Returns
    -------
    - `dict`: A dictionary with the current model from settings'''
    
    logger.info(f"Current model is {settings.MODEL}")
    return {'name': settings.MODEL}

@router.get('/alive')
def check_ollama_running():
    '''Checks whether '''
    try: 
        ollama.ps()
        logger.info("Ollama is running.")
        return True
    except ConnectionError as e:
        logger.error("Ollama is not running.")
        return False


@router.post('/change')
def change_current_model(new_model: ChangeModelRequest):
    '''Change the selected model in settings.
    
    Params
    ------
    - `dict[str, str]: Returns a dictionary with a success message.`
    - `HTTPException` with code 500 if ollama throws a `ConnectionError` or an `HTTPException` with code 404 if the model was not found currently installed.'''
    try:
        logger.info(f"Changing current model to {new_model.model_name}")
        all_models = get_all_models()

        for model in all_models['models']:
            print( model)
            logger.debug(f"Checking model: {model['model']}")
            if model['model'] == new_model.model_name:
                settings.MODEL = new_model.model_name
                logger.info(f"Model changed to {settings.MODEL}")
                return {'message': f'Success! model set to {settings.MODEL}'}
            else:
                continue
    except ConnectionError as e:
        logger.error("Failed to change model: Ollama not installed or not running.")
        return HTTPException(status_code=500, detail='Ollama either not installed or not running.')

    logger.warning(f"Model {new_model.model_name} not found among installed models.")
    return HTTPException(status_code=404, detail='The model you are trying to set as default was not found installed. Maybe pull it from ollama?')
