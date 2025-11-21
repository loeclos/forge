import {Box, useApp} from 'ink';
import {useEffect, useState} from 'react';
import CommandSelect from '../components/command-select.js';
import Input from '../components/input.js';
import MenuComponent from '../components/menu.js';
import MessagesComponent from '../components/messages.js';
import useMessageService from '../services/use-message-service.js';
import {Command} from '../services/types/command.js';

export default function Chat() {
	const [query, setQuery] = useState('');
	const {sendAndRecieveMessage, messages, currentMessage} =
		useMessageService(null);

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

	const [possibleCommands, setPossibleCommands] =
		useState<Command[]>(defaultCommands);
	const [enteringCommand, setEnteringCommand] = useState(false);
	const [selectedCommand, setSelectedCommand] = useState('');
	const [showMenu, setShowMenu] = useState(false);
	const {exit} = useApp();

	const handleInputSubmit = (value: string) => {
		if (!enteringCommand) {
			sendAndRecieveMessage(value);
			setQuery('');
		}
	};

	const handleCommandSelect = (item: any) => {
		setSelectedCommand(item.value);
		setQuery('/');
	};

	useEffect(() => {
		if (query.startsWith('/')) {
			setEnteringCommand(true);
			setSelectedCommand('');
		} else {
			setEnteringCommand(false);
		}
	}, [query]);

	useEffect(() => {
		if (enteringCommand) {
			const cmd = query.slice(1);

			setPossibleCommands(() => {
				const newCmds = defaultCommands.filter(command =>
					command.name.includes(cmd),
				);
				return newCmds;
			});
		} else {
			setPossibleCommands(defaultCommands);
		}
	}, [enteringCommand]);

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

	return (
		<Box width={'100%'} flexDirection="column" gap={0} flexWrap="wrap">
			<Box>
				<MessagesComponent
					messages={messages}
					currentMessage={currentMessage}
				/>
			</Box>

			{showMenu ? <MenuComponent componentKey={selectedCommand} /> : null}

			<Input
				query={query}
				setQuery={setQuery}
				handleSumbit={handleInputSubmit}
			/>
			{enteringCommand && !showMenu ? (
				<CommandSelect
					commands={possibleCommands}
					handleSelect={handleCommandSelect}
				/>
			) : null}
		</Box>
	);
}
