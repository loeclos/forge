import {Box, Text} from 'ink'

export default function Skeleton() {
	return (
		<Box
			paddingLeft={1}
			borderStyle={'round'}
			width={'100%'}
			borderColor={'#F4E9D7'}
		>
			<Text>
                Waiting...
			</Text>
		</Box>
	);
}