# http.hook.ts Documentation

## File Overview

Custom React hook for making HTTP requests. Provides a reusable hook for API communication with status management and error handling.

**Location:** `frontend/source/hooks/http.hook.ts`

## Imports

```typescript
import { useState, useCallback } from "react";
```

## Hook: `useHttp`

Custom hook for HTTP request management.

### Signature

```typescript
export const useHttp = () => { ... }
```

### Returns

```typescript
{
    request: (url: string, method?: string, body?: string | null, headers?: object) => Promise<any>;
    clearError: () => void;
    status: string;
    setStatus: (status: string) => void;
}
```

**Return Values:**
- `request`: Function to make HTTP requests
- `clearError`: Function to clear error state
- `status`: Current request status
- `setStatus`: Function to manually update status

### State

```typescript
const [status, setStatus] = useState('waiting');
```

**Status Values:**
- `'waiting'`: Initial state, no request in progress
- `'loading'`: Request in progress
- `'error'`: Request failed

### Function: `request`

Makes an HTTP request and handles response/errors.

**Signature:**
```typescript
const request = useCallback(async (
    url: string, 
    method: string = 'GET', 
    body: string | null = null, 
    headers: object = {'Content-Type': 'application/json'}
) => Promise<any>, []);
```

**Parameters:**
- `url` (string, required): Request URL
- `method` (string, optional): HTTP method. Default: `'GET'`
- `body` (string | null, optional): Request body. Default: `null`
- `headers` (object, optional): Request headers. Default: `{'Content-Type': 'application/json'}`

**Returns:**
- `Promise<any>`: Promise resolving to response data or rejecting with error

**Behavior:**

1. **Set Loading Status:**
   ```typescript
   setStatus('loading');
   ```

2. **Make Request:**
   ```typescript
   const response = await fetch(url, {method, body, headers});
   ```

3. **Check Response:**
   ```typescript
   if (!response.ok) {
       throw new Error(`Could not fetch ${url}, status: ${response.status}`);
   }
   ```

4. **Parse JSON:**
   ```typescript
   const data = await response.json();
   ```

5. **Check for API Errors:**
   ```typescript
   if (data.status_code === 500) {
       throw new Error(data.detail);
   }
   ```

6. **Return Data:**
   ```typescript
   return data;
   ```

7. **Error Handling:**
   ```typescript
   catch(e) {
       setStatus('error');
       throw e;
   }
   ```

**Error Handling:**
- Sets status to 'error' on failure
- Throws error for caller to handle
- Checks both HTTP status and API error responses

---

### Function: `clearError`

Clears error state and sets status back to loading.

**Signature:**
```typescript
const clearError = useCallback(() => {
    setStatus('loading');
}, []);
```

**Behavior:**
- Sets status to 'loading' (not 'waiting')
- Used to reset error state before retrying

**Note:** Sets status to 'loading' rather than 'waiting', which may be intentional for UI state management.

---

## Usage

```typescript
const {request, clearError, status, setStatus} = useHttp();

// GET request
try {
    const data = await request('http://api.example.com/data');
    console.log(data);
} catch (error) {
    console.error('Request failed:', error);
}

// POST request
try {
    const result = await request(
        'http://api.example.com/create',
        'POST',
        JSON.stringify({name: 'Test'}),
        {'Content-Type': 'application/json'}
    );
    console.log(result);
} catch (error) {
    if (status === 'error') {
        clearError();
        // Retry logic
    }
}

// Check status
if (status === 'loading') {
    console.log('Request in progress...');
}
```

## Related Files

- `services/use-models-service.ts` - Uses this hook
- Other services may use this hook for API communication

## Notes

1. **useCallback:** Functions are memoized with `useCallback` to prevent unnecessary re-renders.

2. **Status Management:** Provides status tracking for UI state management.

3. **Error Handling:** Handles both HTTP errors and API-level errors.

4. **Flexible:** Supports different HTTP methods, bodies, and headers.

5. **Type Safety:** Returns `any` type, which could be improved with generics.

6. **Error State:** Error state must be manually cleared with `clearError()`.

7. **API Error Detection:** Checks for `status_code === 500` in response, which is FastAPI's error format.

