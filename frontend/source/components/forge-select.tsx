import {Text} from 'ink';
import SelectInput from 'ink-select-input';
import {SelectItemType} from '../services/types/select.js';

type ForgeSelectInputProps = {
	items: SelectItemType[];
	onSelect: (item: SelectItemType) => void;
};

/**
 * `SelectInput` preconfigured with Forge's shared indicator and item renderers.
 *
 * The indicator/item components were duplicated across every menu that used a
 * select list; this wraps them in one place so callers only pass `items` and
 * `onSelect`.
 */
export default function ForgeSelectInput({
	items,
	onSelect,
}: ForgeSelectInputProps) {
	return (
		<SelectInput
			items={items}
			indicatorComponent={({isSelected}) => (
				<Text color={'#6FA4AF'}>{isSelected ? '❯ ' : '  '}</Text>
			)}
			itemComponent={({isSelected, label}) => (
				<Text color={isSelected ? '#6FA4AF' : 'white'}>{label}</Text>
			)}
			onSelect={onSelect}
		/>
	);
}
