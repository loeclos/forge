// import { Box, Text } from 'ink';
// import { useEffect, useState } from 'react';
// import useModelService from '../../services/use-models-service.js';
// import setContent from '../../utils/set-content.js';

// export default function CurrentModel() {
// 	const [dir, setDir] = useState('none');
// 	const {getCurrentModel, clearError, status, setStatus} = useModelService();

// 	const updateDir = async () => {
// 		clearError();
// 		getCurrentModel()
// 			.then(dir => setDir(dir.path))
// 			.then(() => setStatus('confirmed'));
// 	};

// 	useEffect(() => {
// 		updateDir();
// 	}, []);

// 	return (
// 		<Box
// 			borderColor={'#F4E9D7'}
// 			borderDimColor
// 			borderStyle={'round'}
// 			width={'100%'}
// 			padding={1}
// 		>
// 			{setContent(status, View, model)}
// 		</Box>
// 	);
// }

// const View = ({data: data}: {data: string}) => {
// 	return (
// 		<Text>
// 			You are currently using: <Text color={'#D97D55'}>{data}</Text>
// 		</Text>
// 	);
// };
