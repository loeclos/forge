# chat.tsx Documentation

## File Overview

Chat interface command component. Provides the main chat interface where users interact with the AI, including message display, command handling, and menu system.

**Location:** `frontend/source/commands/chat.tsx`

## Imports

```typescript
import {Box, useApp} from 'ink';
import {useEffect, useState} from 'react';
import CommandSelect from '../components/command-select.js';
import Input from '../components/input.js';
import MenuComponent from '../components/menu.js';
import MessagesComponent from '../components/messages.js';
import useMessageService from '../services/use-message-service.js';
import {Command} from '../types/command.js';
```

## Component: `Chat`

Main chat interface component.

### State

```typescript
const [query, setQuery] = useState('');
const [possibleCommands, setPossibleCommands] = useState<Command[]>(defaultCommands);
const [enteringCommand, setEnteringCommand] = useState(false);
const [selectedCommand, setSelectedCommand] = useState('');
const [showMenu, setShowMenu] = useState(false);
```

**State Variables:**
- `query` (string): Current input text
- `possibleCommands` (Command[]): Filtered list of available commands
- `enteringCommand` (boolean): Whether user is typing a command
- `selectedCommand` (string): Currently selected command
- `showMenu` (boolean): Whether to show command menu

### Hooks

#### `useMessageService()`

Custom hook for message management.

```typescript
const {sendAndRecieveMessage, messages, currentMessage} = useMessageService(null);
```

**Returns:**
- `sendAndRecieveMessage`: Function to send message and receive response
- `messages`: Array of past messages
- `currentMessage`: Currently streaming message

#### `useApp()`

Ink hook for application control.

```typescript
const {exit} = useApp();
```

**Usage:** Provides `exit()` to exit the application.

### Default Commands

```typescript
const defaultCommands: Command[] = [
	{
		name: 'models',
		description: 'Get available models.',
	},
	{
		name: 'model',
		description: 'Get current model in use.',
	},
	{
		name: 'change',
		description: 'Change the model in use.',
	},
	{
		name: 'exit',
		description: 'Exit forge',
	},
];
```

**Commands:**
- `models`: List all available models
- `model`: Show current model
- `change`: Change active model
- `exit`: Exit application

### Event Handlers

#### `handleInputSubmit(value)`

Handles input submission (Enter key).

```typescript
const handleInputSubmit = (value: string) => {
	if (!enteringCommand) {
		sendAndRecieveMessage(value);
		setQuery('');
	}
};
```

**Behavior:**
- If not entering a command, sends message to AI
- Clears input field
- If entering a command, does nothing (command selection handles it)

#### `handleCommandSelect(item)`

Handles command selection from command list.

```typescript
const handleCommandSelect = (item: any) => {
	setSelectedCommand(item.value);
	setQuery('/');
};
```

**Behavior:**
- Sets selected command
- Sets query to `/` to show command was selected

### Effects

#### Effect 1: Command Detection

```typescript
useEffect(() => {
	if (query.startsWith('/')) {
		setEnteringCommand(true);
		setSelectedCommand('');
	} else {
		setEnteringCommand(false);
		setSelectedCommand('');
	}

	if (enteringCommand) {
		const cmd = query.slice(1);
		setPossibleCommands(() => {
			const newCmds = defaultCommands.filter(command => command.name.includes(cmd));
			return newCmds;
		});
	} else {
		setPossibleCommands(defaultCommands);
	}
}, [query]);
```

**Behavior:**
- Detects if query starts with `/` (command mode)
- Filters commands based on typed text
- Updates `enteringCommand` and `possibleCommands` states

**Command Filtering:**
- Filters commands where name includes the typed text
- Example: Typing `/mo` shows `models` and `model`

#### Effect 2: Command Execution

```typescript
useEffect(() => {
	if (selectedCommand === 'exit') {
		exit();
	}
	if (selectedCommand != '') {
		setShowMenu(true);
	} else {
		setShowMenu(false);
	}
}, [selectedCommand]);
```

**Behavior:**
- Exits application if `exit` command selected
- Shows menu component for other commands
- Hides menu when no command selected

### Render

The component renders:

1. **Messages Display:**
   ```tsx
   <MessagesComponent messages={messages} currentMessage={currentMessage} />
   ```

2. **Menu Component** (if command selected):
   ```tsx
   {showMenu ? <MenuComponent componentKey={selectedCommand} /> : null}
   ```

3. **Input Component:**
   ```tsx
   <Input
       query={query}
       setQuery={setQuery}
       handleSumbit={handleInputSubmit}
   />
   ```

4. **Command Select** (if entering command):
   ```tsx
   {enteringCommand && !showMenu ? (
       <CommandSelect
           commands={possibleCommands}
           handleSelect={handleCommandSelect}
       />
   ) : null}
   ```

## Command Flow

1. **User Types `/`:**
   - `enteringCommand` becomes `true`
   - Command select component appears
   - Shows filtered command list

2. **User Types Command Name:**
   - Commands are filtered based on input
   - Matching commands shown in select list

3. **User Selects Command:**
   - `selectedCommand` is set
   - Menu component appears
   - Command-specific UI is shown

4. **Command Execution:**
   - `exit`: Exits application
   - Other commands: Show menu component

## Related Files

- `components/messages.tsx` - Message display component
- `components/input.tsx` - Input component
- `components/command-select.tsx` - Command selection component
- `components/menu.tsx` - Menu component
- `services/use-message-service.ts` - Message service hook

## Notes

1. **Command System:** Uses `/` prefix to distinguish commands from regular messages.

2. **Command Filtering:** Dynamically filters commands as user types.

3. **State Management:** Manages multiple states for command flow and message display.

4. **Conditional Rendering:** Shows different components based on state (command mode, menu, etc.).

5. **Message Service:** Uses custom hook for message management and API communication.

6. **Exit Handling:** Special handling for exit command to close application.

7. **Typo:** Function name `handleSumbit` has a typo (should be `handleSubmit`), but this matches the prop name in Input component.

