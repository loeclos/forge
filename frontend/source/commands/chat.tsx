import React from 'react';
import {Text} from 'ink';
import SecurityQuestionComponent from '../components/security-question.js'
import zod from 'zod';

export const isDefault = true;

// export const options = zod.object({
// 	name: zod.string().default('Stranger').describe('Name'),
// });

// type Props = {
// 	options: zod.infer<typeof options>;
// };

// {options}: Props
// export default function Index() {
// 	return (
// 		<Text>
// 			Hello, <Text color="green"></Text>
// 		</Text>
// 	);
// }


import { Box, Newline, useInput, useApp} from 'ink';
import { useEffect, useState } from 'react';

interface CwdResponse {
	dir: string | undefined;
	message: string | undefined;
}

export default function App() {
	const [cwd, setCwd] = useState('');
	const [proceedConsent, setProceedConsent] = useState(false);
	const [lastKeyPressed, setLastKeyPressed] = useState('');
	const [mainServerEndpoint, setMainServerEndpoint] = useState('http://127.0.0.1:8000');
	const { exit } = useApp();

	useEffect(() => {
		setMainServerEndpoint(process.env['MAIN_ENDPOINT'] || 'http://127.0.0.1:8000');
	})

	useEffect(() => {
		const fetchCwd = async (): Promise<CwdResponse> => {
			const response = await fetch(`${mainServerEndpoint}/utils/getcwd`);
			const data: CwdResponse = await response.json();
			return data;
		};

		fetchCwd()
			.then(data => {
				setCwd(data?.dir || '');
			})
			.catch(error => {
				console.error('Error fetching cwd:', error);
			});
	}, []);

	useInput((input, key) => {
		if (key.escape) {
			exit();
		}
		
		if (lastKeyPressed === 'ctrl' && input === 'c') {
			exit();
		}

		setLastKeyPressed(input);
	});

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

			{proceedConsent === false ? (
				<SecurityQuestionComponent
					cwd={cwd}
					setProceedConsent={setProceedConsent}
				/>
			) : null}

			{proceedConsent ? (
				<MainComponent activeDir={activeDir} exit={exit} />
			) : null}
		</Box>
	);
}

function View() {
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

			{enteringCommand && !showInfoComponent ? (
				<CommandSelect
					commands={commands}
					handleChange={handleCommandChange}
					filterBy={filterBy}
				/>
			) : null}
		</Box>
	);
}
