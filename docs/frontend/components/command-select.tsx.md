# command-select.tsx Documentation

## File Overview

Command selection component. Displays a selectable list of available commands when user is typing a command (starts with `/`).

**Location:** `frontend/source/components/command-select.tsx`

## Imports

```typescript
import {Box, Text} from 'ink';
import SelectInput from 'ink-select-input';
import {Command} from '../types/command.js';
```

## Component: `CommandSelect`

Selectable command list component.

### Props

```typescript
{
    commands: Command[];
    handleSelect: ({value}: {value: string}) => void;
}
```

**Props:**
- `commands` (Command[]): Array of available commands to display
- `handleSelect` (function): Callback when a command is selected

### Render

```tsx
<Box borderStyle={'round'} borderDimColor paddingX={1}>
    <SelectInput
        items={commands.map(command => {
            return {
                label: `${command.name} - ${command.description}`,
                value: command.name,
            };
        })}
        indicatorComponent={({isSelected}) => (
            <Text color={'#6FA4AF'}>{isSelected ? '❯ ' : '  '}</Text>
        )}
        itemComponent={({isSelected, label}) => (
            <Text color={isSelected ? '#6FA4AF' : 'white'}>{label}</Text>
        )}
        onSelect={handleSelect}
    />
</Box>
```

**Styling:**
- Border: Round, dimmed
- Padding: Horizontal padding of 1

**SelectInput Configuration:**
- `items`: Maps commands to select items with label and value
- `indicatorComponent`: Custom indicator showing `❯ ` for selected item
- `itemComponent`: Custom item renderer with color based on selection
- `onSelect`: Calls `handleSelect` when item is selected

**Item Format:**
- `label`: `"{command.name} - {command.description}"`
- `value`: `command.name`

**Colors:**
- Selected item: `#6FA4AF` (cyan)
- Unselected item: `white`

## Usage

```tsx
<CommandSelect
    commands={possibleCommands}
    handleSelect={handleCommandSelect}
/>
```

## Related Files

- `types/command.ts` - Command type definition
- `commands/chat.tsx` - Uses this component
- `ink-select-input` - Underlying select component library

## Notes

1. **Command Formatting:** Displays commands as "name - description" for clarity.

2. **Visual Indicator:** Uses `❯ ` character to indicate selected item.

3. **Color Coding:** Selected items are highlighted in cyan color.

4. **Keyboard Navigation:** Users can navigate with arrow keys and select with Enter.

5. **Dynamic List:** Commands list is filtered based on user input in parent component.

