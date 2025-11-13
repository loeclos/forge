# loading.tsx Documentation

## File Overview

Simple loading indicator component.

**Location:** `frontend/source/components/loading.tsx`

## Imports

```typescript
import {Box, Text} from 'ink'
```

## Component: `Loading`

Simple loading message component.

### Render

```tsx
<Box width={'100%'}>
    <Text>
        Loading...
    </Text>
</Box>
```

**Styling:**
- Width: Full width
- Content: "Loading..." text

## Usage

```tsx
<Loading />
```

## Related Files

- `utils/set-content.tsx` - Uses this component for loading state
- Other components may use this directly

## Notes

1. **Simple Component:** Minimal loading indicator.

2. **Reusable:** Can be used anywhere loading state is needed.

3. **Consistent:** Provides consistent loading message across the app.

