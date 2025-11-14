# error.tsx Documentation

## File Overview

Error message display component.

**Location:** `frontend/source/components/error.tsx`

## Imports

```typescript
import {Box, Text} from 'ink';
```

## Component: `ErrorMessage`

Component that displays error messages.

### Props

```typescript
{
    errorMessage: string;
}
```

**Props:**
- `errorMessage` (string): Error message to display

### Render

```tsx
<Box width={'100%'}>
    <Text>[ERROR] {errorMessage}</Text>
</Box>
```

**Styling:**
- Width: Full width
- Format: `[ERROR] {errorMessage}`

## Usage

```tsx
<ErrorMessage errorMessage="Something went wrong" />
```

## Related Files

- `utils/set-content.tsx` - Uses this component for error state
- Other components may use this directly

## Notes

1. **Error Format:** Prefixes error with `[ERROR]` for visibility.

2. **Simple Display:** Minimal error display component.

3. **Reusable:** Can be used anywhere error display is needed.

