import {Box} from 'ink';
import {Command} from '../services/types/command.js';
import ForgeSelectInput from './forge-select.js';

export default function CommandSelect({
	commands,
	handleSelect,
}: {
	commands: Command[];
	handleSelect: ({value}: {value: string}) => void;
}) {
	return (
		<Box borderStyle={'round'} borderDimColor paddingX={1}>
			<ForgeSelectInput
				items={commands.map(command => {
					return {
						label: `${command.name} - ${command.description}`,
						value: command.name,
					};
				})}
				onSelect={handleSelect}
			/>
		</Box>
	);
}
