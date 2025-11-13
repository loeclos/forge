# cli.tsx Documentation

## File Overview

Entry point for the Forge CLI application. Initializes the Pastel framework and starts the application.

**Location:** `frontend/source/cli.tsx`

## Code

```typescript
#!/usr/bin/env node
import Pastel from 'pastel';

const app = new Pastel({
	importMeta: import.meta,
});

await app.run();
```

## Components

### Pastel Application

The file creates and runs a Pastel application instance.

**Initialization:**
```typescript
const app = new Pastel({
	importMeta: import.meta,
});
```

**Configuration:**
- `importMeta`: Uses `import.meta` to provide module metadata to Pastel
- This allows Pastel to discover and load commands

**Execution:**
```typescript
await app.run();
```

Starts the Pastel application, which will:
1. Discover available commands
2. Parse command-line arguments
3. Execute the appropriate command
4. Handle routing to command components

## Shebang

```typescript
#!/usr/bin/env node
```

The shebang line allows the file to be executed directly as a script:
```bash
./dist/cli.js
```

## Command Discovery

Pastel automatically discovers commands from the `commands/` directory:
- `commands/app.tsx` - Default command (marked with `isDefault = true`)
- `commands/chat.tsx` - Chat command

## Related Files

- `commands/app.tsx` - Default command executed on startup
- `commands/chat.tsx` - Chat command
- `package.json` - Defines the CLI binary entry point

## Notes

1. **Pastel Framework:** Pastel is a CLI framework that provides command routing and discovery.

2. **Async Execution:** Uses `await` for async application startup.

3. **Module Metadata:** `import.meta` provides information about the current module, which Pastel uses for command discovery.

4. **Entry Point:** This is the entry point defined in `package.json` as `"bin": "dist/cli.js"`.

