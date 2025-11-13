# message.ts Documentation

## File Overview

TypeScript type definition for chat messages.

**Location:** `frontend/source/types/message.ts`

## Type Definition

### `Message`

Type definition for a chat message containing user input and AI response.

```typescript
export type Message = {
    id: string | undefined;
    user: string;
    model: string | undefined;
};
```

**Fields:**
- `id` (string | undefined): Unique message identifier (UUID)
- `user` (string): User's message text
- `model` (string | undefined): AI's response text (may be undefined for incomplete messages)

## Usage

```typescript
import {Message} from '../types/message.js';

const message: Message = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    user: 'What is Python?',
    model: 'Python is a programming language...'
};
```

## Related Files

- `components/messages.tsx` - Uses this type
- `services/use-message-service.ts` - Creates and manages Message objects

## Notes

1. **Optional Fields:** `id` and `model` are optional to support incomplete/streaming messages.

2. **Simple Structure:** Minimal type definition focusing on essential message data.

3. **Type Safety:** Provides type checking for message objects throughout the application.

