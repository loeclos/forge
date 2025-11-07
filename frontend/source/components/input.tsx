import { Box, Text} from 'ink';
import {TextInput}


export default function Input() {
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
						onChange={text => {
							setQuery(text);
							handleInputChange(text);
						}}
						onSubmit={() => handleSendMessage(query, true)}
						placeholder='Enter your message and press "Enter"'
					/>
				</Text>
			</Box>
    );
}