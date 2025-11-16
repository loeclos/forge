import {Box, Text} from 'ink';
import SelectInput from 'ink-select-input';
import {Command} from '../services/types/command.js';

export default function CommandSelect({
	commands,
	handleSelect,
}: {
	commands: Command[];
	handleSelect: ({value}: {value: string}) => void;
}) {
	return (
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
	);
}
