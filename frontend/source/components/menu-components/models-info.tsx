import {Box, Text} from 'ink';
import Divider from '../divider.js';
import {Model} from '../../types/models.js';
import {useState, useEffect} from 'react';
import useModelService from '../../services/use-models-service.js';
import setContent from '../../utils/set-content.js';

export default function ModelsInfoComponent() {
	const [models, setModels] = useState<Model[]>([]);
	const [errorMessage, setErrorMessage] = useState('');
	const {getAllModels, clearError, status, setStatus} = useModelService();

	useEffect(() => {
		updateModels();
	}, []);

	const updateModels = async () => {
		clearError();
		getAllModels()
			.then(setModels)
			.then(() => setStatus('confirmed'))
			.catch(e => {
				setErrorMessage(e.message);
			});
	};

	return (
		<Box
			borderColor={'#F4E9D7'}
			borderDimColor
			width={'100%'}
			paddingX={2}
			paddingY={1}
			gap={1}
			borderStyle={'round'}
			marginY={1}
		>
			{setContent(status, View, models, errorMessage)}
		</Box>
	);
}

const View = ({ data: data }: { data: Model[] }) => {
	
	return (
		<Box>
			<Box width={'100%'} flexDirection="column" flexWrap="wrap">
				<Text color={'#D97D55'}>Model name</Text>
				<Divider />
				<Box width={'100%'} flexDirection="column" gap={1} flexWrap="wrap">
					{data.map(model => (
						<Text key={model.name}>{model.name}</Text>
					))}
				</Box>
			</Box>
			<Box width={'100%'} flexDirection="column" flexWrap="wrap">
				<Text color={'#D97D55'}>Model Size (B)</Text>
				<Divider />
				<Box
					width={'100%'}
					flexDirection="column"
					gap={1}
					flexWrap="wrap"
					alignItems="flex-end"
				>
					{data.map(model => (
						<Text key={model.name}>{model.size}</Text>
					))}
				</Box>
			</Box>
		</Box>
	);
};
