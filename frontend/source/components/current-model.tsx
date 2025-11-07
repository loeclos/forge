
const CurrentModelComponent = () => {
	const [model, setModel] = useState('none');

	const getModel = async () => {
		const response = await fetch(`${MAIN_ENDPOINT}/models/current`);

		const data: Promise<currentModelResponse> = (await response).json();

		return data;
	};

	const setNewModel = async () => {
		const modelResponse = await getModel();
		setModel(modelResponse['model']);
	};

	useEffect(() => {
		setNewModel();
	}, []);

	return (
		<Box
			borderColor={'#F4E9D7'}
			borderDimColor
			borderStyle={'round'}
			width={'100%'}
			padding={1}
		>
			<Text>
				You are currently using: <Text color={'#D97D55'}>{model}</Text>
			</Text>
		</Box>
	);
};
