# Frontend Documentation

## Overview

The Forge frontend is a terminal-based CLI application built with React and Ink. It provides an interactive chat interface for communicating with AI models through the backend API.

## Architecture

### Core Technologies

1. **React**: UI component library
2. **Ink**: React renderer for CLI applications
3. **Pastel**: CLI framework for building terminal apps
4. **TypeScript**: Type-safe JavaScript
5. **Ink Components**: 
   - `ink-text-input`: Text input component
   - `ink-select-input`: Select/dropdown component

### Application Structure

1. **CLI Entry Point** (`source/cli.tsx`)
   - Pastel framework initialization
   - Application bootstrap

2. **Commands** (`source/commands/`)
   - `app.tsx`: Main application command (default)
   - `chat.tsx`: Chat interface command

3. **Components** (`source/components/`)
   - UI components for rendering the interface
   - Menu components for model management

4. **Services** (`source/services/`)
   - API communication hooks
   - Message and model management

5. **Hooks** (`source/hooks/`)
   - Custom React hooks for HTTP requests

6. **Types** (`source/types/`)
   - TypeScript type definitions

7. **Utils** (`source/utils/`)
   - Utility functions

## Project Structure

```
frontend/
├── source/                 # TypeScript source code
│   ├── cli.tsx            # CLI entry point
│   ├── commands/          # CLI commands
│   │   ├── app.tsx        # Main app command
│   │   └── chat.tsx       # Chat command
│   ├── components/        # React components
│   │   ├── command-select.tsx
│   │   ├── divider.tsx
│   │   ├── error.tsx
│   │   ├── input.tsx
│   │   ├── loading.tsx
│   │   ├── messages.tsx
│   │   ├── menu.tsx
│   │   ├── security-question.tsx
│   │   ├── skeleton.tsx
│   │   └── menu-components/
│   │       ├── change-current-model.tsx
│   │       ├── current-model.tsx
│   │       └── models-info.tsx
│   ├── hooks/             # React hooks
│   │   └── http.hook.ts
│   ├── services/          # Service hooks
│   │   ├── use-message-service.ts
│   │   └── use-models-service.ts
│   ├── types/             # TypeScript types
│   │   ├── command.ts
│   │   ├── message.ts
│   │   ├── models.ts
│   │   └── select.ts
│   └── utils/             # Utility functions
│       └── set-content.tsx
├── dist/                  # Compiled JavaScript
├── package.json          # Dependencies and scripts
└── tsconfig.json         # TypeScript configuration
```

## Key Features

### Chat Interface
- Real-time streaming responses
- Message history display
- Command system with `/` prefix
- Session management

### Model Management
- List available models
- View current model
- Change active model
- Model information display

### User Experience
- Security prompt for directory trust
- Loading states
- Error handling
- Keyboard navigation

## Commands

### Built-in Commands

Type `/` followed by a command:

- `/models` - List all available models
- `/model` - Show current model
- `/change` - Change the active model
- `/exit` - Exit the application

## Development

### Building

**Development (watch mode):**
```bash
npm run dev
# or
pnpm dev
```

**Production build:**
```bash
npm run build
# or
pnpm build
```

### Running

After building:
```bash
node dist/cli.js
```

### Testing

```bash
npm test
# or
pnpm test
```

## Configuration

### Environment Variables

Create `.env.local` in the `frontend/` directory:

```env
MAIN_ENDPOINT=http://127.0.0.1:8000
```

This sets the backend API endpoint.

## Dependencies

### Production Dependencies

- `ink`: React renderer for CLI
- `ink-select-input`: Select component
- `ink-text-input`: Text input component
- `pastel`: CLI framework
- `react`: React library
- `uuid`: UUID generation
- `zod`: Schema validation
- `dotenv`: Environment variable loading

### Development Dependencies

- `typescript`: TypeScript compiler
- `@types/react`: React type definitions
- `ava`: Test framework
- `xo`: Linter
- `prettier`: Code formatter

## File Documentation

Detailed documentation for each file:

- [cli.tsx](cli.tsx.md) - CLI entry point
- [commands/app.tsx](commands/app.tsx.md) - Main app command
- [commands/chat.tsx](commands/chat.tsx.md) - Chat command
- [components/](components/) - Component documentation
- [services/](services/) - Service documentation
- [hooks/](hooks/) - Hook documentation
- [types/](types/) - Type documentation

## Related Documentation

- [Installation Guide](../INSTALLATION.md)
- [API Reference](../API.md)
- [Backend Documentation](../backend/README.md)

