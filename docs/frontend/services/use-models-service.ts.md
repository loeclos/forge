# use-models-service.ts Documentation

## File Overview

Custom React hook for managing Ollama models. Provides functions to get current model, list all models, and change the active model.

**Location:** `frontend/source/services/use-models-service.ts`

## Imports

```typescript
import dotenv from 'dotenv';
import {useHttp} from '../hooks/http.hook.js';
```

## Hook: `useModelService`

Custom hook for model management operations.

### Signature

```typescript
export default function useModelService()
```

### Parameters

None

### Returns

```typescript
{
    getCurrentModel: () => Promise<ModelResponse>;
    getAllModels: () => Promise<Model[]>;
    setCurrentModel: (modelName: string) => Promise<any>;
    clearError: () => void;
    status: string;
    setStatus: (status: string) => void;
}
```

**Return Values:**
- `getCurrentModel`: Function to get current active model
- `getAllModels`: Function to get all available models
- `setCurrentModel`: Function to change the active model
- `clearError`: Function to clear error state
- `status`: Current operation status
- `setStatus`: Function to update status

### Functions

#### `getCurrentModel()`

Retrieves the currently active model from the backend.

**Signature:**
```typescript
const getCurrentModel = async () => Promise<ModelResponse>
```

**Returns:**
- `Promise<ModelResponse>`: Promise resolving to current model

**Implementation:**
```typescript
const getCurrentModel = async () => {
    const res = await request(
        `${process.env['MAIN_ENDPOINT']}/api/models/current`,
    );
    return res;
};
```

**API Endpoint:** `GET /api/models/current`

**Response:**
```typescript
{
    name: string;
}
```

---

#### `getAllModels()`

Retrieves a list of all available models from the backend.

**Signature:**
```typescript
const getAllModels = async () => Promise<Model[]>
```

**Returns:**
- `Promise<Model[]>`: Promise resolving to array of models

**Implementation:**
```typescript
const getAllModels = async () => {
    const res = await request(
        `${process.env['MAIN_ENDPOINT']}/api/models/all`,
    );
    return res;
};
```

**API Endpoint:** `GET /api/models/all`

**Response:**
```typescript
Model[] // Array of Model objects
```

---

#### `setCurrentModel(modelName)`

Changes the active model to a different model.

**Signature:**
```typescript
const setCurrentModel = async (modelName: string) => Promise<any>
```

**Parameters:**
- `modelName` (string): Name of the model to set as active

**Returns:**
- `Promise<any>`: Promise resolving to response

**Implementation:**
```typescript
const setCurrentModel = async (modelName: string) => {
    const res = await request(
        `${process.env['MAIN_ENDPOINT']}/api/models/change`,
        'POST',
        JSON.stringify({model_name: modelName}),
        {
            'Content-Type': 'application/json',
        },
    );
    return res;
};
```

**API Endpoint:** `POST /api/models/change`

**Request Body:**
```json
{
    "model_name": "llama2:7b"
}
```

**Response:**
```json
{
    "message": "Success! model set to llama2:7b"
}
```

---

### HTTP Hook Integration

Uses `useHttp` hook for all API requests:

```typescript
const {request, clearError, status, setStatus} = useHttp();
```

**Benefits:**
- Consistent error handling
- Status management
- Request abstraction

## Usage

```typescript
const {
    getCurrentModel,
    getAllModels,
    setCurrentModel,
    status,
    clearError
} = useModelService();

// Get current model
const current = await getCurrentModel();
console.log(current.name);

// Get all models
const models = await getAllModels();
models.forEach(model => {
    console.log(model.name, model.size);
});

// Change model
await setCurrentModel('llama2:7b');

// Check status
if (status === 'error') {
    clearError();
}
```

## Related Files

- `hooks/http.hook.ts` - HTTP request hook
- `types/models.ts` - Model type definitions
- `components/menu-components/` - Components using this hook

## Notes

1. **HTTP Hook:** Uses `useHttp` for consistent API communication.

2. **Error Handling:** Errors are handled by the `useHttp` hook.

3. **Status Management:** Status is managed by `useHttp` hook.

4. **Environment Variables:** Uses `MAIN_ENDPOINT` from environment.

5. **Type Safety:** Returns typed responses matching backend API.

6. **Async Operations:** All functions are async and return promises.

