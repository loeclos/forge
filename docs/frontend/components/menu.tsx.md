# menu.tsx Documentation

## File Overview

Menu component that displays different UI components based on the selected command. Acts as a router for command-specific views.

**Location:** `frontend/source/components/menu.tsx`

## Imports

```typescript
import { Box, Text } from 'ink';
import CurrentModel from './menu-components/current-model.js';
import ModelsInfoComponent from './menu-components/models-info.js';
import ChangeModelComponent from './menu-components/change-current-model.js';
```

## Components

### `DefaultComponent`

Default component shown when an unknown command is selected.

**Render:**
```tsx
<Box 
    width={'100%'} 
    flexDirection="column" 
    gap={0} 
    paddingX={2} 
    paddingY={1} 
    flexWrap="wrap" 
    borderStyle={'round'} 
    borderColor={'#D97D55'}
>
    <Text>Something went wrong. Maybe try running the command again?</Text>
</Box>
```

**Usage:** Shown when `componentKey` doesn't match any known command.

---

### `ExitComponent`

Component shown when exit command is selected.

**Render:**
```tsx
<Box 
    width={'100%'} 
    flexDirection="column" 
    gap={0} 
    paddingX={2} 
    paddingY={1} 
    flexWrap="wrap" 
    borderStyle={'round'} 
    borderColor={'#D97D55'}
>
    <Text>Exiting...</Text>
</Box>
```

**Usage:** Shown briefly before application exits.

---

## Component Map

```typescript
interface ComponentMapType {
	[key: string]: React.ComponentType | null;
}

const componentMap: ComponentMapType = {
	model: CurrentModel,
	models: ModelsInfoComponent,
	change: ChangeModelComponent,
	exit: ExitComponent
};
```

**Mapping:**
- `model` → `CurrentModel` component
- `models` → `ModelsInfoComponent` component
- `change` → `ChangeModelComponent` component
- `exit` → `ExitComponent` component

---

## Component: `MenuComponent`

Main menu component that routes to the appropriate command component.

### Props

```typescript
interface MenuProps {
	componentKey: string;
}
```

**Props:**
- `componentKey` (string): Command name to display (e.g., "model", "models", "change", "exit")

### Render

```tsx
const SelectedComponent = componentMap[componentKey.toLowerCase()] || DefaultComponent;

return (
    <Box>
        <SelectedComponent />
    </Box>
);
```

**Behavior:**
- Converts `componentKey` to lowercase for case-insensitive matching
- Looks up component in `componentMap`
- Falls back to `DefaultComponent` if command not found
- Renders the selected component

## Command Routing

The component acts as a simple router:

1. **Command Received:** `componentKey` prop contains command name
2. **Lookup:** Component is looked up in `componentMap`
3. **Render:** Appropriate component is rendered
4. **Fallback:** Unknown commands show `DefaultComponent`

## Usage

```tsx
<MenuComponent componentKey="model" />
<MenuComponent componentKey="models" />
<MenuComponent componentKey="change" />
<MenuComponent componentKey="exit" />
<MenuComponent componentKey="unknown" /> // Shows DefaultComponent
```

## Related Files

- `menu-components/current-model.tsx` - Current model display
- `menu-components/models-info.tsx` - Models list display
- `menu-components/change-current-model.tsx` - Model change interface
- `commands/chat.tsx` - Uses this component

## Notes

1. **Simple Router:** Acts as a simple component router based on command key.

2. **Case Insensitive:** Converts command key to lowercase for matching.

3. **Fallback:** Provides default component for unknown commands.

4. **Component Map:** Uses a simple object map for routing, which is efficient and easy to extend.

5. **Extensibility:** Easy to add new commands by adding entries to `componentMap`.

