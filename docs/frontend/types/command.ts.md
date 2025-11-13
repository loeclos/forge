# command.ts Documentation

## File Overview

TypeScript type definition for CLI commands.

**Location:** `frontend/source/types/command.ts`

## Type Definition

### `Command`

Type definition for a CLI command with name and description.

```typescript
export type Command = {
	name: string;
	description: string;
}
```

**Fields:**
- `name` (string): Command name (e.g., "models", "model", "change", "exit")
- `description` (string): Human-readable description of what the command does

## Usage

```typescript
import {Command} from '../types/command.js';

const commands: Command[] = [
    {
        name: 'models',
        description: 'Get available models.',
    },
    {
        name: 'model',
        description: 'Get current model in use.',
    },
];
```

## Related Files

- `commands/chat.tsx` - Defines and uses Command objects
- `components/command-select.tsx` - Displays Command objects

## Notes

1. **Simple Structure:** Minimal type definition for command metadata.

2. **Type Safety:** Provides type checking for command definitions.

3. **Extensibility:** Easy to add new commands by creating new Command objects.

