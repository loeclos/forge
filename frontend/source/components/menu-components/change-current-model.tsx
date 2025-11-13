import {Box, Text} from 'ink';
import SelectInput from 'ink-select-input';
import {useEffect, useState} from 'react';
import useModelService from '../../services/use-models-service.js';
import {Model} from '../../types/models.js';
import setContent from '../../utils/set-content.js';

export default function ChangeModelComponent() {
	const [models, setModels] = useState<Model[] | null>(null);
	const [model, setModel] = useState('');
	const [modelAlreadySet, setModelAlreadySet] = useState(false);
	const [errorMessage, setErrorMessage] = useState('');

	const {
		getAllModels,
		getCurrentModel,
		setCurrentModel,
		clearError,
		status,
		setStatus,
	} = useModelService();

	const updateModels = async () => {
		clearError();
		getAllModels()
			.then(setModels)
			.then(() => setStatus('confirmed'))
			.catch(e => {
				setErrorMessage(e.message);
			});
	};

	const updateModel = async () => {
		clearError();
		getCurrentModel()
			.then(model => setModel(model.name))
			.then(() => setStatus('confirmed'));
	};

	useEffect(() => {
		updateModels();
		updateModel();
	}, []);


	const handleSelectSubmit = (item: {label: string; value: string}) => {
		setCurrentModel(item.value)
			.then(() => setStatus('confirmed'))
			.then(() => setModelAlreadySet(true))
			.catch(e => setErrorMessage(e.message));
	};

	return (
		<Box
			paddingX={2}
			paddingY={1}
			borderStyle={'round'}
			borderColor={'#D97D55'}
			width={'100%'}
		>
			{!modelAlreadySet ? setContent(
				status,
				View,
				{
					models: models,
					model: model,
					handleSelectSubmit: handleSelectSubmit,
				},
				errorMessage,
			): (			<Box flexDirection="column" gap={1} flexWrap="wrap">
				<Text>Model set.</Text>
			</Box>)}
		</Box>
	);
}

interface ViewProps {
	models: Model[];
	model: string;
	handleSelectSubmit: () => void;
}

const View = ({data: data}: {data: ViewProps}) => {
	if (!data.models || data.models.length === 0) {
		return (
			<Box flexDirection="column" gap={1} flexWrap="wrap">
				<Text>Loading models...</Text>
			</Box>
		);
	}

	return (
		<Box flexDirection="column" gap={1} flexWrap="wrap">
			<Text>Choose the model you want to use (currently {data.model}): </Text>
			<SelectInput
				items={data.models.map(model => {
					return {
						label: `${model.name}`,
						value: model.name,
					};
				})}
				indicatorComponent={({isSelected}) => (
					<Text color={'#6FA4AF'}>{isSelected ? '❯ ' : '  '}</Text>
				)}
				itemComponent={({isSelected, label}) => (
					<Text color={isSelected ? '#6FA4AF' : 'white'}>{label}</Text>
				)}
				onSelect={data.handleSelectSubmit}
			/>
		</Box>
	);
};
