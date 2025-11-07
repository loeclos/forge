const ChangeModelComponent = () => {
	const [models, setModels] = useState<Model[]>([]);
	// const [currentModel, setCurrentModel] = useState('');
	// const [currentIndex, setCurrentIndex] = useState(0);
	const [modelSet, setModelSet] = useState(false);

	const getAllModels = async () => {
		const response = await fetch(`${MAIN_ENDPOINT}/models`);

		const data: Promise<Model[]> = (await response).json();

		return data;
	};

	// const getModel = async () => {
	// 	const response = await fetch(`${MAIN_ENDPOINT}/models/current`);

	// 	const data: Promise<currentModelResponse> = (await response).json();

	// 	return data;
	// };

	const setAllModels = async () => {
		const modelResponse = await getAllModels();
		setModels(modelResponse);
	};
	// const setCurrentModel_ = async () => {
	// 	const modelResponse = await getModel();
	// 	setCurrentModel(modelResponse['model']);
	// };

const setModel = async (modelName: string) => {
	try {
		const response = await fetch(`${MAIN_ENDPOINT}/models/change`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({model_name: modelName}),
		});

		const data: changeModelResponse = await response.json();
			console.log(data?.model, modelName)

		if (data) {
			setModelSet(true); // ✅ Only after confirmation
		}
	} catch (error) {
		console.error('Failed to change model:', error);
	}
};

	useEffect(() => {
		setAllModels();
		// setCurrentModel_();
		// modelSet.
	}, []);

	const handleSelectChange = (item: {label: string; value: string}) => {
		setModel(item.value);
	};

	return (
		<Box
			paddingX={2}
			paddingY={1}
			borderStyle={'round'}
			borderColor={'#D97D55'}
			width={'100%'}
		>
			{!modelSet ? (
				<Box flexDirection="column" gap={1} flexWrap="wrap">
					<Text>Choose the model you want to use:</Text>
					<SelectInput
						items={models.map(models => {
							return {
								label: `${models.name}`,
								value: models.name,
							};
						})}
						indicatorComponent={({isSelected}) => (
							<Text color={'#6FA4AF'}>{isSelected ? '❯ ' : '  '}</Text>
						)}
						itemComponent={({isSelected, label}) => (
							<Text color={isSelected ? '#6FA4AF' : 'white'}>{label}</Text>
						)}
						onSelect={handleSelectChange}
					/>
				</Box>
			) : (
				<Text>Model set.</Text>
			)}
		</Box>
	);
};