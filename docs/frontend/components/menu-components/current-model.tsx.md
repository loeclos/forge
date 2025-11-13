# current-model.tsx Documentation

## File Overview

Component that displays the currently active Ollama model.

**Location:** `frontend/source/components/menu-components/current-model.tsx`

## Imports

```typescript
import { Box, Text } from 'ink';
import { useEffect, useState } from 'react';
import useModelService from '../../services/use-models-service.js';
import setContent from '../../utils/set-content.js';
```

## Component: `CurrentModel`

Component that fetches and displays the current model.

### State

```typescript
const [model, setModel] = useState('none');
```

**State Variables:**
- `model` (string): Current model name

### Hooks

#### `useModelService()`

```typescript
const {getCurrentModel, clearError, status, setStatus} = useModelService();
```

**Usage:** Provides functions to get current model and manage status.

### Functions

#### `updateModel()`

Fetches the current model from the backend.

```typescript
const updateModel = async () => {
    clearError();
    getCurrentModel()
        .then(model => setModel(model.name))
        .then(() => setStatus('confirmed'));
};
```

**Behavior:**
- Clears any previous errors
- Fetches current model
- Updates model state
- Sets status to 'confirmed'

### Effects

#### Effect: Fetch Model on Mount

```typescript
useEffect(() => {
    updateModel();
}, []);
```

**Behavior:** Fetches model when component mounts.

### Render

```tsx
<Box
    borderColor={'#F4E9D7'}
    borderDimColor
    borderStyle={'round'}
    width={'100%'}
    padding={1}
>
    {setContent(status, View, model)}
</Box>
```

**Styling:**
- Border: Round, dimmed, color `#F4E9D7`
- Width: Full width
- Padding: 1

**Content:** Uses `setContent` utility to show loading/error/content states.

---

## Component: `View`

Display component for the model name.

### Props

```typescript
{data: string}
```

**Props:**
- `data` (string): Model name

### Render

```tsx
<Text>
    You are currently using: <Text color={'#D97D55'}>{data}</Text>
</Text>
```

**Styling:** Model name is displayed in orange color (`#D97D55`).

## Usage

```tsx
<CurrentModel />
```

## Related Files

- `services/use-models-service.ts` - Model service hook
- `utils/set-content.tsx` - Content rendering utility
- `components/menu.tsx` - Uses this component

## Notes

1. **Auto-fetch:** Automatically fetches model on mount.

2. **Status Management:** Uses status-based rendering for loading/error states.

3. **Styling:** Consistent with other menu components.

4. **Error Handling:** Clears errors before fetching.

