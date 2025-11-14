# app.tsx Documentation

## File Overview

Main application command component. This is the default command that runs when the CLI starts. It displays a welcome message, shows a security question, and renders the chat interface.

**Location:** `frontend/source/commands/app.tsx`

## Imports

```typescript
import dotenv from 'dotenv';
import { Box, Newline, Text, useApp, useInput } from 'ink';
import { useEffect, useState } from 'react';
import SecurityQuestionComponent from '../components/security-question.js';
import Chat from './chat.js';
```

## Exports

### `isDefault`

Marks this command as the default command that runs when no specific command is provided.

**Type:** `boolean`

**Value:** `true`

**Usage:** Pastel uses this to determine which command to run by default.

---

## Component: `App`

Main application component that orchestrates the initial setup and chat interface.

### State

```typescript
const [cwd, setCwd] = useState('');
const [proceedConsent, setProceedConsent] = useState(false);
const [lastKeyPressed, setLastKeyPressed] = useState('');
const [mainServerEndpoint, setMainServerEndpoint] = useState('http://127.0.0.1:8000');
```

**State Variables:**
- `cwd` (string): Current working directory from backend
- `proceedConsent` (boolean): Whether user has consented to proceed
- `lastKeyPressed` (string): Last key pressed (for keyboard handling)
- `mainServerEndpoint` (string): Backend API endpoint URL

### Hooks

#### `useApp()`

Ink hook for application-level functionality.

```typescript
const { exit } = useApp();
```

**Usage:** Provides `exit()` function to exit the application.

#### `useInput()`

Ink hook for handling keyboard input.

```typescript
useInput((input, key) => {
	if (key.escape) {
		exit();
	}
	
	if (lastKeyPressed === 'ctrl' && input === 'c') {
		exit();
	}

	setLastKeyPressed(input);
});
```

**Behavior:**
- Exits on `Escape` key
- Exits on `Ctrl+C`
- Tracks last key pressed

### Effects

#### Effect 1: Load Environment Variables

```typescript
useEffect(() => {
	setMainServerEndpoint(process.env['MAIN_ENDPOINT'] || 'http://127.0.0.1:8000');
}, []);
```

**Behavior:**
- Loads `MAIN_ENDPOINT` from environment variables
- Falls back to default `http://127.0.0.1:8000`
- Runs once on mount

#### Effect 2: Fetch Current Working Directory

```typescript
useEffect(() => {
	const fetchCwd = async (): Promise<CwdResponse> => {
		const response = await fetch(`${mainServerEndpoint}/api/utils/getcwd`);
		const data: CwdResponse = await response.json();
		return data;
	};

	fetchCwd()
		.then(data => {
			setCwd(data?.dir || '');
		})
		.catch(error => {
			console.error('Error fetching cwd:', error);
		});
}, []);
```

**Behavior:**
- Fetches current working directory from backend
- Sets `cwd` state with directory path
- Handles errors gracefully
- Runs once on mount

**API Endpoint:** `GET /api/utils/getcwd`

### Render

The component conditionally renders:

1. **Welcome Message:**
   ```tsx
   <Text>
       <Text color={'magentaBright'} bold>
           Welcome to Forge!
       </Text>
       <Newline />
       <Text>
           Forge can write, test and debug code right from your terminal.
           Describe a task to get started or enter ? for help. Forge uses AI, check for
           mistakes.
       </Text>
   </Text>
   ```

2. **Security Question** (if not consented):
   ```tsx
   {proceedConsent === false ? (
       <SecurityQuestionComponent
           cwd={cwd}
           setProceedConsent={setProceedConsent}
       />
   ) : null}
   ```

3. **Chat Interface** (if consented):
   ```tsx
   {proceedConsent ? (
       <Chat />
   ) : null}
   ```

## Types

### `CwdResponse`

Interface for current working directory API response.

```typescript
interface CwdResponse {
	dir: string | undefined;
	message: string | undefined;
}
```

**Fields:**
- `dir` (string | undefined): Directory path
- `message` (string | undefined): Optional message

## Environment Configuration

### `.env.local`

The component loads environment variables from `.env.local`:

```env
MAIN_ENDPOINT=http://127.0.0.1:8000
```

**Loading:**
```typescript
dotenv.config({ path: ".env.local" });
```

## User Flow

1. **Application Starts:**
   - Welcome message displayed
   - Environment variables loaded
   - Current directory fetched from backend

2. **Security Prompt:**
   - User sees security question component
   - Displays current working directory
   - User must consent to proceed

3. **Chat Interface:**
   - After consent, chat interface is displayed
   - User can start chatting with AI

4. **Exit:**
   - User can exit with `Escape` or `Ctrl+C`

## Related Files

- `components/security-question.tsx` - Security prompt component
- `commands/chat.tsx` - Chat interface component
- `hooks/http.hook.ts` - HTTP request utilities

## Notes

1. **Default Command:** This is the default command that runs when the CLI starts.

2. **Security:** The security question ensures users are aware of the directory the application will access.

3. **Environment Variables:** Backend endpoint is configurable via environment variables.

4. **Error Handling:** Errors fetching CWD are logged but don't crash the app.

5. **Keyboard Shortcuts:** Supports standard CLI exit shortcuts (Escape, Ctrl+C).

6. **Conditional Rendering:** Uses conditional rendering to show security prompt or chat based on consent state.

