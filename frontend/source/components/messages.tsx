
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
