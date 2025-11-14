import dotenv from 'dotenv';
import { Box, Newline, Text, useApp, useInput } from 'ink';
import { useEffect, useState } from 'react';
import SecurityQuestionComponent from '../components/security-question.js';
import Chat from './chat.js';

export const isDefault = true;
dotenv.config({ path: ".env.local" });

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
	}, []);

	useEffect(() => {
		const fetchCwd = async (): Promise<CwdResponse> => {
			const response = await fetch(`${mainServerEndpoint}/api/utils/getcwd`);
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
				<Text color={'#6FA4AF'}> 
					════════════════  <Newline />
					╔═╗╔═╗╦═╗╔═╗╔═╗   <Newline />
					╠╣ ║ ║╠╦╝║ ╦║╣    <Newline /> 
					╚  ╚═╝╩╚═╚═╝╚═╝   <Newline />  
					Agentic CLI       <Newline />
					<Newline /><Newline />
				</Text>
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
				<Chat />
			) : null}
		</Box>
	);
}

