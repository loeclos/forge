'''
Ollama functions that get used throughout the project
'''

import ollama

def check_ollama_running():
    '''Checks whether '''
    try: 
        ollama.ps()
        return True
    except ConnectionError as e:
        return False
    
def get_all_models():
    '''A function to get all models from ollama.
    
    Returns
    -------
    - `list`'''

    try: 
        return ollama.list()
    except ConnectionError as e:
        raise
