# select.ts Documentation

## File Overview

TypeScript type definitions for select input components.

**Location:** `frontend/source/types/select.ts`

## Type Definitions

### `SelectItemType`

Type for a single select item with label and value.

```typescript
export type SelectItemType = {
	label: string;
	value: string;
};
```

**Fields:**
- `label` (string): Display text for the item
- `value` (string): Value associated with the item

**Usage:**
```typescript
const item: SelectItemType = {
    label: 'Yes, proceed',
    value: 'proceed'
};
```

---

### `SelectItemsType`

Type for an array of select items.

```typescript
export type SelectItemsType = SelectItemType[];
```

**Usage:**
```typescript
const items: SelectItemsType = [
    {label: 'Option 1', value: 'opt1'},
    {label: 'Option 2', value: 'opt2'},
];
```

## Related Files

- `components/security-question.tsx` - Uses SelectItemType
- `components/command-select.tsx` - Uses similar structure
- `ink-select-input` - Library that uses this format

## Notes

1. **Generic Type:** Can be used for any select input component.

2. **Label/Value Pattern:** Common pattern for select components (display text vs. actual value).

3. **Array Type:** `SelectItemsType` is a convenience type alias for arrays.

4. **Library Compatibility:** Matches the format expected by `ink-select-input`.

