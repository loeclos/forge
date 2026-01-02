import { Box, Text} from 'ink';
import TextInput from 'ink-text-input'


interface InputProps {
	query: string;
	setQuery: (text: string) => void;
	handleSumbit: (value: string) => void;
}

export default function Input({ query, setQuery, handleSumbit }: InputProps) {
	return (
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
					onChange={setQuery}
					onSubmit={(value) => handleSumbit(value)}
					placeholder='Enter your message and press "Enter"'
				/>
			</Text>
		</Box>
	);
}