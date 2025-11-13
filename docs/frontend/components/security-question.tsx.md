# security-question.tsx Documentation

## File Overview

Security question component that asks users to confirm they trust files in the current working directory before proceeding.

**Location:** `frontend/source/components/security-question.tsx`

## Imports

```typescript
import { Text, Box, Newline } from 'ink';
import SelectInput from 'ink-select-input';
import { SelectItemType } from '../types/select.js';
```

## Constants

### `securityQuestionSelectOptions`

Array of select options for the security question.

```typescript
const securityQuestionSelectOptions: SelectItemType[] = [
	{
		label: '1. Yes, proceed',
		value: 'proceed',
	},
	{
		label: '3. No, exit (Esc)',
		value: 'exit',
	},
];
```

**Options:**
- `proceed`: User consents to proceed
- `exit`: User chooses to exit

**Note:** Option numbering shows "1" and "3" (missing "2"), which may be intentional or a typo.

---

## Component: `SecurityQuestionComponent`

Security consent prompt component.

### Props

```typescript
{
    cwd: string;
    setProceedConsent: (arg0: boolean) => void;
}
```

**Props:**
- `cwd` (string): Current working directory path
- `setProceedConsent` (function): Function to set consent state

### Event Handler

#### `handleSecuritySelect(item)`

Handles selection from security question options.

```typescript
const handleSecuritySelect = ( item : SelectItemType ) => {
	if (item.value === 'proceed') {
		setProceedConsent(true);
	} else {
		setProceedConsent(false);
	}
}
```

**Behavior:**
- If "proceed" selected, sets consent to `true`
- Otherwise, sets consent to `false`

### Render

```tsx
<Box
    flexDirection="column"
    gap={1}
    flexWrap="wrap"
    width={'100%'}
    paddingX={1}
    borderStyle={'round'}
    borderColor={'#D97D55'}
>
    <Box>
        <Text>Do you trust the files in this folder?</Text>
    </Box>

    <Box
        width={'100%'}
        borderStyle={'round'}
        borderColor={'#B8C4A9'}
        borderDimColor
        paddingX={1}
    >
        <Text>{cwd}</Text>
    </Box>
    
    <Box>
        <Text>
            Forge might access files in this directory. Processing untrusted files
            could lead to unexpected behavior in Forge.
            <Newline />
            With your approval, Forge may run files in this directory. Executing
            unverified code poses security risks.
            <Newline />
            This project also allows Forge to automatically perform bash commands
            on your system.
        </Text>
    </Box>
    
    <Box>
        <SelectInput
            items={securityQuestionSelectOptions}
            indicatorComponent={({isSelected}) => (
                <Text color={'#6FA4AF'}>{isSelected ? '❯ ' : '  '}</Text>
            )}
            itemComponent={({isSelected, label}) => (
                <Text color={isSelected ? '#6FA4AF' : 'white'}>{label}</Text>
            )}
            onSelect={handleSecuritySelect}
        />
    </Box>
    
    <Box>
        <Text dimColor>
            To select an item, use the ↑↓ keys. To confirm, press enter. Exit with
            Esc
        </Text>
    </Box>
</Box>
```

**Sections:**
1. **Question:** "Do you trust the files in this folder?"
2. **Directory Display:** Shows current working directory in a bordered box
3. **Warning Text:** Explains security implications
4. **Select Input:** Options to proceed or exit
5. **Help Text:** Instructions for navigation

**Styling:**
- Main border: Orange (`#D97D55`)
- Directory box: Green (`#B8C4A9`), dimmed
- Selected item: Cyan (`#6FA4AF`)
- Help text: Dimmed

## Usage

```tsx
<SecurityQuestionComponent
    cwd={cwd}
    setProceedConsent={setProceedConsent}
/>
```

## Related Files

- `types/select.ts` - SelectItemType definition
- `commands/app.tsx` - Uses this component
- `ink-select-input` - Underlying select component

## Notes

1. **Security Purpose:** Ensures users are aware of directory access before proceeding.

2. **Directory Display:** Shows the exact directory path the application will access.

3. **Warning Text:** Clearly explains potential security risks.

4. **User Choice:** Users can choose to proceed or exit.

5. **Keyboard Navigation:** Supports arrow keys and Enter for selection.

6. **Option Numbering:** Options show "1" and "3" (missing "2"), which may be intentional.

