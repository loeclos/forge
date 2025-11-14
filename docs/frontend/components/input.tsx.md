# input.tsx Documentation

## File Overview

Text input component for the chat interface. Provides a styled input field where users type messages and commands.

**Location:** `frontend/source/components/input.tsx`

## Imports

```typescript
import { Box, Text} from 'ink';
import TextInput from 'ink-text-input'
```

## Component: `Input`

Text input component with custom styling.

### Props

```typescript
interface InputProps {
	query: string;
	setQuery: (text: string) => void;
	handleSumbit: (value: string) => void;
}
```

**Props:**
- `query` (string): Current input value
- `setQuery` (function): Function to update input value
- `handleSumbit` (function): Function called when user submits (Enter key)

**Note:** `handleSumbit` has a typo (should be `handleSubmit`), but matches the prop name used in parent components.

### Render

```tsx
<Box
    paddingLeft={1}
    borderStyle={'round'}
    width={'100%'}
    borderColor={'#F4E9D7'}
>
    <Text>
        <Text>❯ </Text>
        <TextInput
            value={query}
            onChange={text => {
                setQuery(text);
            }}
            onSubmit={(value) => handleSumbit(value)}
            placeholder='Enter your message and press "Enter"'
        />
    </Text>
</Box>
```

**Styling:**
- Border: Round border with color `#F4E9D7`
- Width: Full width
- Padding: Left padding of 1
- Prompt: `❯ ` character before input

**TextInput Configuration:**
- `value`: Controlled by `query` prop
- `onChange`: Updates state via `setQuery`
- `onSubmit`: Calls `handleSumbit` when Enter is pressed
- `placeholder`: Help text shown when input is empty

## Usage

```tsx
<Input
    query={query}
    setQuery={setQuery}
    handleSumbit={handleInputSubmit}
/>
```

## Related Files

- `commands/chat.tsx` - Uses this component
- `ink-text-input` - Underlying input component library

## Notes

1. **Controlled Component:** Input value is controlled by parent component state.

2. **Styling:** Uses Ink's Box and Text components for layout and styling.

3. **Prompt Character:** The `❯ ` character provides a visual prompt similar to shell interfaces.

4. **Placeholder:** Shows helpful text when input is empty.

5. **Typo:** Function name `handleSumbit` has a typo but is consistent with parent component usage.

