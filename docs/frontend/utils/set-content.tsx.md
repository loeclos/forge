# set-content.tsx Documentation

## File Overview

Utility function for conditionally rendering components based on status. Provides a consistent pattern for displaying loading, error, and content states.

**Location:** `frontend/source/utils/set-content.tsx`

## Imports

```typescript
import Loading from '../components/loading.js';
import ErrorMessage from '../components/error.js';
import Skeleton from '../components/skeleton.js';
```

## Function: `setContent`

Conditionally renders components based on status state.

### Signature

```typescript
const setContent = (
    status: string, 
    Component: React.ComponentType<{ data: any }>, 
    data: any, 
    errorMessage: string = ''
) => React.ReactNode
```

### Parameters

- `status` (string): Current status ('waiting', 'loading', 'confirmed', 'error')
- `Component` (React.ComponentType): Component to render when status is 'confirmed'
- `data` (any): Data to pass to Component as `data` prop
- `errorMessage` (string, optional): Error message to display. Default: `''`

### Returns

- `React.ReactNode`: Rendered component based on status

### Behavior

```typescript
switch (status) {
    case 'waiting':
        return <Skeleton/>;
    case 'loading':
        return <Loading/>;
    case 'confirmed':
        return <Component data={data}/>;
    case 'error':
        return <ErrorMessage errorMessage={errorMessage} />;
    default:
        throw new Error('Unexpected status state');
}
```

**Status Handling:**
- `'waiting'`: Renders `<Skeleton/>` component
- `'loading'`: Renders `<Loading/>` component
- `'confirmed'`: Renders the provided `Component` with `data` prop
- `'error'`: Renders `<ErrorMessage>` with error message
- `default`: Throws error for unexpected status

## Usage

```typescript
import setContent from '../utils/set-content.js';

// In a component
const MyComponent = ({data}) => <Text>{data}</Text>;

// Render based on status
{setContent(status, MyComponent, myData, errorMessage)}
```

**Example:**
```typescript
// Waiting state
setContent('waiting', ViewComponent, null) // Shows Skeleton

// Loading state
setContent('loading', ViewComponent, null) // Shows Loading

// Success state
setContent('confirmed', ViewComponent, {name: 'Test'}) // Shows ViewComponent with data

// Error state
setContent('error', ViewComponent, null, 'Something went wrong') // Shows ErrorMessage
```

## Related Files

- `components/loading.tsx` - Loading component
- `components/error.tsx` - Error component
- `components/skeleton.tsx` - Skeleton component
- `components/menu-components/` - Components using this utility

## Notes

1. **Status Pattern:** Provides consistent status-based rendering pattern.

2. **Component Prop:** Component receives data via `data` prop.

3. **Error Handling:** Throws error for unexpected status values.

4. **Default Parameter:** `errorMessage` has default empty string.

5. **Type Safety:** Uses `any` for data type, which could be improved with generics.

6. **Reusability:** Can be used across multiple components for consistent UI states.

