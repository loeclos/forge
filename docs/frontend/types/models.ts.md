# models.ts Documentation

## File Overview

TypeScript type definitions for Ollama model data structures.

**Location:** `frontend/source/types/models.ts`

## Type Definitions

### `ModelResponse`

Type for API response containing current model information.

```typescript
export interface ModelResponse {
	name: string;
}
```

**Fields:**
- `name` (string): Name of the model

**Usage:**
```typescript
const response: ModelResponse = {
    name: 'qwen2.5:14b'
};
```

**API Endpoint:** Used for `GET /api/models/current` response

---

### `Model`

Type for model information including name, size, and parameter size.

```typescript
export interface Model {
	name: string;
	size: number;
	param_size: string;
}
```

**Fields:**
- `name` (string): Model name (e.g., "qwen2.5:14b")
- `size` (number): Model size in bytes
- `param_size` (string): Parameter size as string (e.g., "14B", "7B")

**Usage:**
```typescript
const model: Model = {
    name: 'qwen2.5:14b',
    size: 10000000000,
    param_size: '14B'
};
```

**API Endpoint:** Used for `GET /api/models/all` response items

## Related Files

- `services/use-models-service.ts` - Uses these types
- `components/menu-components/models-info.tsx` - Displays Model objects
- `components/menu-components/change-current-model.tsx` - Uses Model type

## Notes

1. **Type Safety:** Provides type checking for model-related API responses.

2. **Size Format:** `size` is a number (bytes), while `param_size` is a string (human-readable).

3. **Interface vs Type:** Uses `interface` for extensibility, though both could work.

4. **API Alignment:** Types match the backend API response format.

