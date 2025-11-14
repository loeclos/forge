# messages.tsx Documentation

## File Overview

Component for displaying chat messages. Shows both user messages and AI responses in a styled format.

**Location:** `frontend/source/components/messages.tsx`

## Imports

```typescript
import {memo} from 'react';
import {Message} from '../types/message.js';
import {Box, Text} from 'ink';
```

## Components

### `CurrentMessageComponent`

Displays a single message that is currently being streamed (in progress).

**Props:**
```typescript
{message: Message}
```

**Render:**
```tsx
<Box width={'100%'} flexDirection="column" gap={0} flexWrap="wrap">
    <Box
        paddingX={1}
        borderStyle={'round'}
        borderColor={'white'}
        borderDimColor
        width={'100%'}
    >
        <Text>❯ </Text>
        <Text>{message.user}</Text>
    </Box>
    <Box
        paddingX={2}
        paddingY={1}
        borderStyle={'round'}
        borderColor={'#D97D55'}
        width={'100%'}
    >
        <Text>{message.model}</Text>
    </Box>
</Box>
```

**Styling:**
- User message: White border, dimmed, with `❯ ` prompt
- AI response: Orange border (`#D97D55`), with padding

---

### `MessagesComponent`

Main component that displays all messages and the current streaming message.

**Props:**
```typescript
{
    messages: Message[];
    currentMessage: Message | null;
}
```

**Props:**
- `messages` (Message[]): Array of completed messages
- `currentMessage` (Message | null): Currently streaming message (if any)

**Render:**
```tsx
<Box width={'100%'} flexDirection="column" gap={0} flexWrap="wrap">
    {messages.map((message, index) => {
        return (
            <Box
                width={'100%'}
                flexDirection="column"
                gap={0}
                flexWrap="wrap"
                key={index}
            >
                <Box
                    paddingX={1}
                    borderStyle={'round'}
                    borderColor={'white'}
                    borderDimColor
                    width={'100%'}
                >
                    <Text>❯ </Text>
                    <Text>{message.user}</Text>
                </Box>
                <Box
                    paddingX={2}
                    paddingY={1}
                    borderStyle={'round'}
                    borderColor={'#D97D55'}
                    width={'100%'}
                >
                    <Text>{message.model}</Text>
                </Box>
            </Box>
        );
    })}
    {currentMessage ? (<CurrentMessageComponent message={currentMessage} />) : null}
</Box>
```

**Behavior:**
- Maps over `messages` array to display each message
- Each message shows user input and AI response
- Displays `currentMessage` if it exists (streaming message)
- Uses index as key for React list rendering

**Memoization:**
```typescript
const MessagesComponent = memo(
    ({ messages, currentMessage }: { messages: Message[]; currentMessage: Message | null }) => {
        // Component implementation
    },
);
```

**Memoization:** Component is memoized with `memo()` to prevent unnecessary re-renders when props haven't changed.

## Message Display Format

Each message is displayed as:

1. **User Message Box:**
   - Border: White, dimmed, round
   - Content: `❯ ` + user message text
   - Padding: Horizontal padding of 1

2. **AI Response Box:**
   - Border: Orange (`#D97D55`), round
   - Content: AI response text
   - Padding: Horizontal 2, vertical 1

## Usage

```tsx
<MessagesComponent 
    messages={messages} 
    currentMessage={currentMessage} 
/>
```

## Related Files

- `types/message.ts` - Message type definition
- `commands/chat.tsx` - Uses this component
- `services/use-message-service.ts` - Provides messages data

## Notes

1. **Memoization:** Uses React.memo for performance optimization.

2. **Streaming Support:** Displays both completed messages and currently streaming message.

3. **Styling:** Consistent styling with orange theme for AI responses.

4. **Key Prop:** Uses array index as key, which is acceptable for this use case (messages are appended, not reordered).

5. **Layout:** Uses flexbox for vertical layout with no gap between message parts.

