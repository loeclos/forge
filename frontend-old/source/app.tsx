import {Text, Box, Newline, useInput, useApp} from 'ink';
import TextInput from 'ink-text-input';
import {useEffect, useState} from 'react';
import SelectInput from 'ink-select-input';
import Divider from './components/divider.js';
import {v4 as uuid4} from 'uuid';
import { memo } from 'react';




interface ChatResponse {
	response: string | undefined;
	session_id: string | undefined;
}



const MAIN_ENDPOINT = 'http://127.0.0.1:8000';



type MainComponentProps = {
	activeDir: string;
	exit: (error?: Error | undefined) => void;
};
type Message = {
	id: string;
	user: string;
	model: string | undefined;
};

interface Model {
	name: string;
	size: number;
	param_size: string;
}

const commands = [
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



type currentModelResponse = {
	model: string;
};


interface changeModelResponse {
	model: string;
}


const commandOutputs: {[key: string]: React.ComponentType | null} = {
	models: ModelsComponent,
	model: CurrentModelComponent,
	change: ChangeModelComponent,
	exit: null,
};

const MainComponent = ({activeDir, exit}: MainComponentProps) => {
	const [sessionId, setSessionId] = useState<string | undefined>(undefined);
	const [currentMessageId, setCurrentMessageId] = useState('');
	const [lastQuery, setLastQuery] = useState('');
	const [query, setQuery] = useState('');
	const [messages, setMessages] = useState<Message[]>([]);
	const [enteringCommand, setEnteringCommand] = useState(false);
	const [currentCommand, setCurrentCommand] = useState('');
	const [infoComponent, setInfoComponent] = useState('exit');
	const [showInfoComponent, setShowInfoComponent] = useState(false);
	const [filterBy, setFilterBy] = useState('');

	const handleInputChange = (text: string) => {
		setEnteringCommand(false);
		setShowInfoComponent(false);

		if (text.startsWith('/')) {
			setEnteringCommand(true);
			const cmd = text.slice(1); // remove the leading "/"
			setFilterBy(cmd);
		} 
	};
	const handleCommandChange = ({value}: {value: string}) => {
		setCurrentCommand(value);
	};

	useEffect(() => {
		switch (currentCommand) {
			case 'exit':
				exit();
				break;
			default:
				if (currentCommand.trim() != '') {
					setQuery(``);
					setInfoComponent(currentCommand);
					setShowInfoComponent(true);
				}
				break;
		}
	}, [currentCommand]);

	const handleSendMessage = async (
		message: string,
		stream: boolean = false,
	) => {
		if (enteringCommand) {
			return;
		}
		setLastQuery(query);
		setCurrentMessageId(uuid4());
		setMessages(messages => [
			...messages,
			{id: currentMessageId, user: message, model: 'Loading model response...'},
		]);

		setQuery('');

		if (!stream) {
			// ---- Non-streaming mode ----
			const response = await fetch(`${MAIN_ENDPOINT}/chat`, {
				method: 'POST',
				body: JSON.stringify({message, session_id: sessionId, stream: false}),
				headers: {'Content-Type': 'application/json'},
			});

			const data: ChatResponse = await response.json();

			if (!sessionId) {
				setSessionId(data.session_id);
			}

			setMessages(messages => [
				...messages,
				{id: currentMessageId, user: lastQuery, model: data.response},
			]);
			return data;
		}

		// ---- Streaming mode ----
		const response = await fetch('http://127.0.0.1:8000/chat', {
			method: 'POST',
			body: JSON.stringify({message, session_id: sessionId, stream: true}),
			headers: {'Content-Type': 'application/json'},
		});

		if (!response.body) {
			throw new Error('No response body');
		}

		if (response.status == 500) {
			setMessages(messages =>
				messages.map(item => {
					if (item.id === currentMessageId) {
						item.model =
							(item.model === 'Loading model response...'
								? ''
								: (item.model ?? '')) +
							' [SERVER RETURNED 500]: Possibly forgot to start ollama?';
						return item;
					}
					return item;
				}),
			);
		}

		const reader = response.body.getReader();
		const decoder = new TextDecoder();

		let buffer: string | undefined = '';
		let accumulatedResponse = '';

		while (true) {
			const {value, done} = await reader.read();
			if (done) break;

			buffer += decoder.decode(value, {stream: true});
			const parts: string[] | undefined = buffer?.split('\n\n');

			for (let i = 0; i < parts.length - 1; i++) {
				const line = parts[i]?.trim();
				if (!line?.startsWith('data: ')) continue;

				const data = line?.replace('data: ', '');
				if (data === '[DONE]') {
					return;
				}

				try {
					const parsed = JSON.parse(data);
					if (!sessionId && parsed.session_id) {
						setSessionId(parsed.session_id);
					}
					if (parsed.content) {
						if (messages.length != 0) {
setMessages(messages =>
	messages.map(item => {
		if (item.id === currentMessageId) {
			const updatedModel =
				(item.model === 'Loading model response...' ? '' : (item.model ?? '')) +
				parsed.content;

			return {...item, model: updatedModel};
		}
		return item;
	}),
);

						} else {
							setMessages([
								{
									id: currentMessageId,
									user: message,
									model: accumulatedResponse,
								},
							]);
						}

						accumulatedResponse = (accumulatedResponse ?? '') + parsed.content;
					}
				} catch (e) {
					console.error('Failed to parse chunk', e, data);
				}
			}

			buffer = parts[parts.length - 1]; // keep leftover
		}
		return response;
	};

	const CurrentInfoComponent = commandOutputs[infoComponent];

	return (

	);
};

interface Command {
	name: string;
	description: string;
}

const CommandSelect = ({
	commands,
	handleChange,
	filterBy,
}: {
	commands: Command[];
	handleChange: ({value}: {value: string}) => void;
	filterBy: null | string;
}) => {
	return (
		<Box borderStyle={'round'} borderDimColor paddingX={1}>
			<SelectInput
				items={commands
					.filter(command => {
						if (filterBy) {
							if (command.name.includes(filterBy)) {
								return true;
							} else {
								return false;
							}
						} else {
							return true;
						}
					})
					.map(command => {
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
				onSelect={handleChange}
			/>
		</Box>
	);
};
