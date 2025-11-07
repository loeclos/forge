

const ModelsInfoComponent = () => {
	const [models, setModels] = useState<Model[]>([]);

	const getAllModels = async () => {
		const response = await fetch(`${MAIN_ENDPOINT}/models`);

		const data: Promise<Model[]> = (await response).json();

		return data;
	};

	const setAllModels = async () => {
		const modelResponse = await getAllModels();
		setModels(modelResponse);
	};

	useEffect(() => {
		setAllModels();
	}, []);

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
			<Box width={'100%'} flexDirection="column" flexWrap="wrap">
				<Text color={'#D97D55'}>Model name</Text>
				<Divider />
				<Box width={'100%'} flexDirection="column" gap={1} flexWrap="wrap">
					{models.map(m => (
						<Text key={m.name}>{m.name}</Text>
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
					{models.map(m => (
						<Text key={m.name}>{m.size}</Text>
					))}
				</Box>
			</Box>
		</Box>
	);
};