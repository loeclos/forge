import {Box, Text} from 'ink';

export default function ErrorMessage({
	errorMessage: errorMessage,
}: {
	errorMessage: string;
}) {
	return (
		<Box
			width={'100%'}
		>
			<Text>[ERROR] {errorMessage}</Text>
		</Box>
	);
}
