import ollama

class ModelsService:
    @staticmethod
    def get_models():
        models_list = []
        models_response = ollama.list()

        # The real list of Model objects is inside .models
        for model in models_response.models:
            models_list.append({'name': model.model, 'size': model.size, 'param_size': model.details.parameter_size})

        return models_list
