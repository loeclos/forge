# change-current-model.tsx Documentation

## File Overview

Component that allows users to change the currently active Ollama model by selecting from a list of available models.

**Location:** `frontend/source/components/menu-components/change-current-model.tsx`

## Imports

```typescript
import {Box, Text} from 'ink';
import SelectInput from 'ink-select-input';
import {useEffect, useState} from 'react';
import useModelService from '../../services/use-models-service.js';
import {Model} from '../../types/models.js';
import setContent from '../../utils/set-content.js';
```

## Component: `ChangeModelComponent`

Component for changing the active model.

### State

```typescript
const [models, setModels] = useState<Model[] | null>(null);
const [model, setModel] = useState('');
const [modelAlreadySet, setModelAlreadySet] = useState(false);
const [errorMessage, setErrorMessage] = useState('');
```

**State Variables:**
- `models` (Model[] | null): Available models list
- `model` (string): Current model name
- `modelAlreadySet` (boolean): Whether model change was successful
- `errorMessage` (string): Error message if operation fails

### Hooks

#### `useModelService()`

```typescript
const {
    getAllModels,
    getCurrentModel,
    setCurrentModel,
    clearError,
    status,
    setStatus,
} = useModelService();
```

**Usage:** Provides functions for model management.

### Functions

#### `updateModels()`

Fetches all available models.

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

#### `updateModel()`

Fetches the current model.

```typescript
const updateModel = async () => {
    clearError();
    getCurrentModel()
        .then(model => setModel(model.name))
        .then(() => setStatus('confirmed'));
};
```

#### `handleSelectSubmit(item)`

Handles model selection and changes the active model.

```typescript
const handleSelectSubmit = (item: {label: string; value: string}) => {
    setCurrentModel(item.value)
        .then(() => setStatus('confirmed'))
        .then(() => setModelAlreadySet(true))
        .catch(e => setErrorMessage(e.message));
};
```

**Behavior:**
- Changes model to selected value
- Sets status to 'confirmed'
- Marks model as set
- Handles errors

### Effects

#### Effect: Initialize on Mount

```typescript
useEffect(() => {
    updateModels();
    updateModel();
}, []);
```

**Behavior:** Fetches both available models and current model on mount.

### Render

```tsx
<Box
    paddingX={2}
    paddingY={1}
    borderStyle={'round'}
    borderColor={'#D97D55'}
    width={'100%'}
>
    {!modelAlreadySet ? setContent(
        status,
        View,
        {
            models: models,
            model: model,
            handleSelectSubmit: handleSelectSubmit,
        },
        errorMessage,
    ): (
        <Box flexDirection="column" gap={1} flexWrap="wrap">
            <Text>Model set.</Text>
        </Box>
    )}
</Box>
```

**Conditional Rendering:**
- If model not set: Shows selection interface
- If model set: Shows success message

**Styling:**
- Border: Round, color `#D97D55`
- Padding: Horizontal 2, vertical 1
- Width: Full width

---

## Component: `View`

Display component for model selection interface.

### Props

```typescript
interface ViewProps {
    models: Model[];
    model: string;
    handleSelectSubmit: () => void;
}
```

**Props:**
- `models` (Model[]): Available models
- `model` (string): Current model name
- `handleSelectSubmit` (function): Selection handler

### Render

```tsx
const View = ({data: data}: {data: ViewProps}) => {
    if (!data.models || data.models.length === 0) {
        return (
            <Box flexDirection="column" gap={1} flexWrap="wrap">
                <Text>Loading models...</Text>
            </Box>
        );
    }

    return (
        <Box flexDirection="column" gap={1} flexWrap="wrap">
            <Text>Choose the model you want to use (currently {data.model}): </Text>
            <SelectInput
                items={data.models.map(model => {
                    return {
                        label: `${model.name}`,
                        value: model.name,
                    };
                })}
                indicatorComponent={({isSelected}) => (
                    <Text color={'#6FA4AF'}>{isSelected ? '❯ ' : '  '}</Text>
                )}
                itemComponent={({isSelected, label}) => (
                    <Text color={isSelected ? '#6FA4AF' : 'white'}>{label}</Text>
                )}
                onSelect={data.handleSelectSubmit}
            />
        </Box>
    );
};
```

**Behavior:**
- Shows loading message if no models
- Displays current model name
- Shows selectable list of models
- Uses SelectInput for selection

**Styling:**
- Selected item: Cyan (`#6FA4AF`)
- Unselected item: White
- Indicator: `❯ ` for selected

## Usage

```tsx
<ChangeModelComponent />
```

## Related Files

- `services/use-models-service.ts` - Model service hook
- `types/models.ts` - Model type definition
- `utils/set-content.tsx` - Content rendering utility
- `ink-select-input` - Select component library

## Notes

1. **Two-Step Process:** Fetches models and current model separately.

2. **Success State:** Shows confirmation message after successful change.

3. **Error Handling:** Displays error messages on failure.

4. **Loading State:** Shows loading message when models are not yet loaded.

5. **Current Model Display:** Shows current model in the prompt text.

