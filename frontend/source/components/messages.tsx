import {memo} from 'react';
import {Message} from '../types/message.js';
import {Box, Text} from 'ink';

const CurrentMessageComponent = ({message}: {message: Message}) => {
	return (
		<Box
			width={'100%'}
			flexDirection="column"
			gap={0}
			flexWrap="wrap"
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
};

const MessagesComponent = memo(
	({
		messages,
		currentMessage,
	}: {
		messages: Message[];
		currentMessage: Message | null;
	}) => {
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
				{currentMessage ? (<CurrentMessageComponent message={currentMessage} />) : (null)}
			</Box>
		);
	},
);

export default MessagesComponent;
