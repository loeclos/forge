import {Text, Box, Newline, useInput, useApp} from 'ink';
import TextInput from 'ink-text-input';
import {useEffect, useState} from 'react';
import SelectInput from 'ink-select-input';
import Divider from './components/divider.js';
import {v4 as uuid4} from 'uuid';
import { memo } from 'react';


type Props = {
	name: string | undefined;
};

interface CwdResponse {
	dir: string | undefined;
	message: string | undefined;
}

interface ChatResponse {
	response: string | undefined;
	session_id: string | undefined;
}

type selectItemType = {
	label: string;
	value: string;
};

const MAIN_ENDPOINT = 'http://127.0.0.1:8000';

const selectItems: selectItemType[] = [
	{
		label: '1. Yes, proceed',
		value: 'proceed',
	},
	{
		label: '2. Yes, and remember this folder for future sessions',
		value: 'proceedAndRemember',
	},
	{
		label: '3. No, exit (Esc)',
		value: 'exit',
	},
];

export default function App({}: Props) {
	const [activeDir, setActiveDir] = useState('');
	const [securityQA, setSecurityQA] = useState('');
	const [latestCtrl, setLatestCtrl] = useState(false);
	const {exit} = useApp();

	useInput((input, key) => {
		if (key.escape) {
			exit();
		}

		if (key.ctrl) {
			setLatestCtrl(true);
		} else {
			setLatestCtrl(false);
		}

		if (latestCtrl && input === 'c') {
			exit();
		}
	});

	useEffect(() => {
		// Define the async function to fetch data
		const fetchCwd = async (): Promise<CwdResponse> => {
			const response = await fetch('http://127.0.0.1:8000/utils/getcwd');
			const data: CwdResponse = await response.json();
			return data;
		};

		// Call the function and handle the response
		fetchCwd()
			.then(data => {
				setActiveDir(data?.dir || '');
			})
			.catch(error => {
				console.error('Error fetching cwd:', error);
			});
	}, []);

	const handleSecuritySelect = (item: selectItemType) => {
		setSecurityQA(item.value);
	};

	return (
		<Box flexDirection="column" gap={1} flexWrap="wrap">
			<Box>
				<Text>
					<Text color={'magentaBright'} bold>
						Welcome to Forge!
					</Text>
					<Newline />
					<Text>
						Forge can write, test and debug code right from your terminal.
						Describe a <Newline />
						task to get started or enter ? for help. Forge uses AI, check for
						mistakes.
					</Text>
				</Text>
			</Box>
			{securityQA === '' ? (
				<SecurityQAComponent
					activeDir={activeDir}
					handleSecuritySelect={handleSecuritySelect}
				/>
			) : null}
			{securityQA === 'proceed' ? (
				<MainComponent activeDir={activeDir} exit={exit} />
			) : null}
		</Box>
	);
}

const SecurityQAComponent = ({
	activeDir,
	handleSecuritySelect,
}: {
	activeDir: string;
	handleSecuritySelect: (item: selectItemType) => void;
}) => {
	return (
		<Box
			flexDirection="column"
			gap={1}
			flexWrap="wrap"
			width={'100%'}
			padding={1}
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
				<Text>{activeDir}</Text>
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
					items={selectItems}
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

const ModelsComponent = () => {
	const [models, setModels] = useState<Model[]>([]);

	const getAllModels = async () => {
		const response = await fetch(`${MAIN_ENDPOINT}/models`);

		const data: Promise<Model[]> = (await response).json();

		return data;
	};

	const setAllModels = async () => {
		const modelResponse = await getAllModels();
		setModels(modelResponse);
	};

	useEffect(() => {
		setAllModels();
	}, []);

	return (
		<Box
			borderColor={'#F4E9D7'}
			borderDimColor
			width={'100%'}
			paddingX={2}
			paddingY={1}
			gap={1}
			borderStyle={'round'}
			marginY={1}
		>
			<Box width={'100%'} flexDirection="column" flexWrap="wrap">
				<Text color={'#D97D55'}>Model name</Text>
				<Divider />
				<Box width={'100%'} flexDirection="column" gap={1} flexWrap="wrap">
					{models.map(m => (
						<Text key={m.name}>{m.name}</Text>
					))}
				</Box>
			</Box>
			<Box width={'100%'} flexDirection="column" flexWrap="wrap">
				<Text color={'#D97D55'}>Model Size (B)</Text>
				<Divider />
				<Box
					width={'100%'}
					flexDirection="column"
					gap={1}
					flexWrap="wrap"
					alignItems="flex-end"
				>
					{models.map(m => (
						<Text key={m.name}>{m.size}</Text>
					))}
				</Box>
			</Box>
		</Box>
	);
};

type currentModelResponse = {
	model: string;
};

const CurrentModelComponent = () => {
	const [model, setModel] = useState('none');

	const getModel = async () => {
		const response = await fetch(`${MAIN_ENDPOINT}/models/current`);

		const data: Promise<currentModelResponse> = (await response).json();

		return data;
	};

	const setNewModel = async () => {
		const modelResponse = await getModel();
		setModel(modelResponse['model']);
	};

	useEffect(() => {
		setNewModel();
	}, []);

	return (
		<Box
			borderColor={'#F4E9D7'}
			borderDimColor
			borderStyle={'round'}
			width={'100%'}
			padding={1}
		>
			<Text>
				You are currently using: <Text color={'#D97D55'}>{model}</Text>
			</Text>
		</Box>
	);
};

interface changeModelResponse {
	model: string;
}
const ChangeModelComponent = () => {
	const [models, setModels] = useState<Model[]>([]);
	// const [currentModel, setCurrentModel] = useState('');
	// const [currentIndex, setCurrentIndex] = useState(0);
	const [modelSet, setModelSet] = useState(false);

	const getAllModels = async () => {
		const response = await fetch(`${MAIN_ENDPOINT}/models`);

		const data: Promise<Model[]> = (await response).json();

		return data;
	};

	// const getModel = async () => {
	// 	const response = await fetch(`${MAIN_ENDPOINT}/models/current`);

	// 	const data: Promise<currentModelResponse> = (await response).json();

	// 	return data;
	// };

	const setAllModels = async () => {
		const modelResponse = await getAllModels();
		setModels(modelResponse);
	};
	// const setCurrentModel_ = async () => {
	// 	const modelResponse = await getModel();
	// 	setCurrentModel(modelResponse['model']);
	// };

const setModel = async (modelName: string) => {
	try {
		const response = await fetch(`${MAIN_ENDPOINT}/models/change`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({model_name: modelName}),
		});

		const data: changeModelResponse = await response.json();
			console.log(data?.model, modelName)

		if (data) {
			setModelSet(true); // ✅ Only after confirmation
		}
	} catch (error) {
		console.error('Failed to change model:', error);
	}
};

	useEffect(() => {
		setAllModels();
		// setCurrentModel_();
		// modelSet.
	}, []);

	const handleSelectChange = (item: {label: string; value: string}) => {
		setModel(item.value);
	};

	return (
		<Box
			paddingX={2}
			paddingY={1}
			borderStyle={'round'}
			borderColor={'#D97D55'}
			width={'100%'}
		>
			{!modelSet ? (
				<Box flexDirection="column" gap={1} flexWrap="wrap">
					<Text>Choose the model you want to use:</Text>
					<SelectInput
						items={models.map(models => {
							return {
								label: `${models.name}`,
								value: models.name,
							};
						})}
						indicatorComponent={({isSelected}) => (
							<Text color={'#6FA4AF'}>{isSelected ? '❯ ' : '  '}</Text>
						)}
						itemComponent={({isSelected, label}) => (
							<Text color={isSelected ? '#6FA4AF' : 'white'}>{label}</Text>
						)}
						onSelect={handleSelectChange}
					/>
				</Box>
			) : (
				<Text>Model set.</Text>
			)}
		</Box>
	);
};

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
		<Box width={'100%'} flexDirection="column" gap={0} flexWrap="wrap">
			<Box>
				<MessagesComponent messages={messages} />
			</Box>
			<Box>
				{showInfoComponent && CurrentInfoComponent && <CurrentInfoComponent />}
			</Box>
			<Box marginTop={2} paddingLeft={1}>
				<Text dimColor>{activeDir}</Text>
			</Box>
			<Box
				paddingLeft={1}
				borderStyle={'round'}
				width={'100%'}
				borderColor={'#F4E9D7'}
			>
				<Text>
					<Text>❯ </Text>
					<TextInput
						value={query}
						onChange={text => {
							setQuery(text);
							handleInputChange(text);
						}}
						onSubmit={() => handleSendMessage(query, true)}
						placeholder='Enter your message and press "Enter"'
					/>
				</Text>
			</Box>
			{enteringCommand && !showInfoComponent ? (
				<CommandSelect
					commands={commands}
					handleChange={handleCommandChange}
					filterBy={filterBy}
				/>
			) : null}
		</Box>
	);
};

const MessagesComponent = memo(({messages}: {messages: Message[]}) => {
	return (
		<Box width={'100%'} flexDirection="column" gap={0} flexWrap="wrap">
			{messages.map((message, index) => {
				return (
					<Box
						width={'100%'}
						flexDirection="column"
						gap={0}
						flexWrap="wrap"
						key={index}
					>
						<Box
							paddingX={1}
							borderStyle={'round'}
							borderColor={'white'}
							borderDimColor
							width={'100%'}
						>
							<Text>❯ </Text>
							<Text>{message.user}</Text>
						</Box>
						<Box
							paddingX={2}
							paddingY={1}
							borderStyle={'round'}
							borderColor={'#D97D55'}
							width={'100%'}
						>
							<Text>{message.model}</Text>
						</Box>
					</Box>
				);
			})}
		</Box>
	);
});

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
