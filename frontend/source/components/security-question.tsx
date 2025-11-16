import { Text, Box, Newline } from 'ink';
import SelectInput from 'ink-select-input';

import { SelectItemType } from '../services/types/select.js';


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

export default function SecurityQuestionComponent({
	cwd,
	setProceedConsent,
}: {
	cwd: string;
	setProceedConsent: (arg0: boolean) => void;
}) {

    const handleSecuritySelect = ( item : SelectItemType ) => {
		if (item.value === 'proceed') {
			setProceedConsent(true);
		} else {
			setProceedConsent(false);
		}
    }

	return (
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
	);
};