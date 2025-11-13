# skeleton.tsx Documentation

## File Overview

Skeleton/placeholder component shown while waiting for data.

**Location:** `frontend/source/components/skeleton.tsx`

## Imports

```typescript
import {Box, Text} from 'ink'
```

## Component: `Skeleton`

Placeholder component for waiting state.

### Render

```tsx
<Box
    paddingLeft={1}
    borderStyle={'round'}
    width={'100%'}
    borderColor={'#F4E9D7'}
>
    <Text>
        Waiting...
    </Text>
</Box>
```

**Styling:**
- Border: Round, color `#F4E9D7`
- Width: Full width
- Padding: Left padding of 1
- Content: "Waiting..." text

## Usage

```tsx
<Skeleton />
```

## Related Files

- `utils/set-content.tsx` - Uses this component for waiting state
- Other components may use this directly

## Notes

1. **Placeholder:** Shows placeholder content while waiting.

2. **Consistent Styling:** Matches input component styling.

3. **Reusable:** Can be used anywhere waiting state is needed.

