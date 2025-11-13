# models-info.tsx Documentation

## File Overview

Component that displays a list of all available Ollama models with their names and sizes.

**Location:** `frontend/source/components/menu-components/models-info.tsx`

## Imports

```typescript
import {Box, Text} from 'ink';
import Divider from '../divider.js';
import {Model} from '../../types/models.js';
import {useState, useEffect} from 'react';
import useModelService from '../../services/use-models-service.js';
import setContent from '../../utils/set-content.js';
```

## Component: `ModelsInfoComponent`

Component that fetches and displays all available models.

### State

```typescript
const [models, setModels] = useState<Model[]>([]);
const [errorMessage, setErrorMessage] = useState('');
```

**State Variables:**
- `models` (Model[]): Array of available models
- `errorMessage` (string): Error message if fetch fails

### Hooks

#### `useModelService()`

```typescript
const {getAllModels, clearError, status, setStatus} = useModelService();
```

**Usage:** Provides function to get all models.

### Functions

#### `updateModels()`

Fetches all models from the backend.

```typescript
const updateModels = async () => {
    clearError();
    getAllModels()
        .then(setModels)
        .then(() => setStatus('confirmed'))
        .catch(e => {
            setErrorMessage(e.message);
        });
};
```

**Behavior:**
- Clears previous errors
- Fetches all models
- Updates models state
- Sets status to 'confirmed'
- Handles errors

### Effects

#### Effect: Fetch Models on Mount

```typescript
useEffect(() => {
    updateModels();
}, []);
```

**Behavior:** Fetches models when component mounts.

### Render

```tsx
<Box
    borderColor={'#F4E9D7'}
    borderDimColor
    width={'100%'}
    paddingX={2}
    paddingY={1}
    gap={1}
    borderStyle={'round'}
    marginY={1}
>
    {setContent(status, View, models, errorMessage)}
</Box>
```

**Styling:**
- Border: Round, dimmed, color `#F4E9D7`
- Padding: Horizontal 2, vertical 1
- Gap: 1
- Margin: Vertical 1

---

## Component: `View`

Display component for the models list.

### Props

```typescript
{ data: Model[] }
```

**Props:**
- `data` (Model[]): Array of models to display

### Render

```tsx
<Box>
    <Box width={'100%'} flexDirection="column" flexWrap="wrap">
        <Text color={'#D97D55'}>Model name</Text>
        <Divider />
        <Box width={'100%'} flexDirection="column" gap={1} flexWrap="wrap">
            {data.map(model => (
                <Text key={model.name}>{model.name}</Text>
            ))}
        </Box>
    </Box>
    <Box width={'100%'} flexDirection="column" flexWrap="wrap">
        <Text color={'#D97D55'}>Model Size (B)</Text>
        <Divider />
        <Box
            width={'100%'}
            flexDirection="column"
            gap={1}
            flexWrap="wrap"
            alignItems="flex-end"
        >
            {data.map(model => (
                <Text key={model.name}>{model.size}</Text>
            ))}
        </Box>
    </Box>
</Box>
```

**Layout:**
- Two columns: Model names and sizes
- Header with orange color (`#D97D55`)
- Divider between header and list
- Right-aligned sizes

## Usage

```tsx
<ModelsInfoComponent />
```

## Related Files

- `services/use-models-service.ts` - Model service hook
- `types/models.ts` - Model type definition
- `components/divider.tsx` - Divider component
- `utils/set-content.tsx` - Content rendering utility

## Notes

1. **Two-Column Layout:** Displays model names and sizes side by side.

2. **Error Handling:** Catches and displays error messages.

3. **Styling:** Consistent with other menu components.

4. **Key Prop:** Uses model name as React key.

