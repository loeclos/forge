import {Box, Newline, Text, useApp, useInput} from 'ink';
import {useEffect, useState} from 'react';
import SecurityQuestionComponent from '../components/security-question.js';
import useFileService from '../services/use-file-service.js';
import Chat from './chat.js';
import zod from 'zod';

export const options = zod.object({
	dir: zod
		.string()
		.nullable()
		.describe('The active directory to start forge in.')
		.default(null),
});

type Props = {
	options: zod.infer<typeof options>;
};


export const isDefault = true;



export default function App({options}: Props) {
	const [cwd, setCwd] = useState('');
	const [proceedConsent, setProceedConsent] = useState(false);
	const [checkedCWD, setCheckedCWD] = useState(false);
	const [lastKeyPressed, setLastKeyPressed] = useState('');
	const {exit} = useApp();
	const {changeCWD, fetchCwd}  = useFileService();

	useEffect(() => {
		if (options.dir) {
			changeCWD(options.dir).then(() => {
				setCheckedCWD(true);
			});
		}
	}, []);

	useEffect(() => {
		fetchCwd()
			.then(data => {
				setCwd(data?.dir || '');
			})
			.catch(error => {
				console.error('Error fetching cwd:', error);
			});
	}, [checkedCWD]);

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
						════════════════ <Newline />
						╔═╗╔═╗╦═╗╔═╗╔═╗ <Newline />
						╠╣ ║ ║╠╦╝║ ╦║╣ <Newline />
						╚  ╚═╝╩╚═╚═╝╚═╝ <Newline />
						Agentic CLI <Newline />
						<Newline />
						<Newline />
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

			{proceedConsent ? <Chat /> : null}
		</Box>
	);
}
