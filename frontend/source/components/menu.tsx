import { Box, Text } from 'ink';
import CurrentModel from './menu-components/current-model.js';
import ModelsInfoComponent from './menu-components/models-info.js';
import ChangeModelComponent from './menu-components/change-current-model.js';

const DefaultComponent = () => {
	return (
		<Box width={'100%'} flexDirection="column" gap={0} paddingX={2} paddingY={1} flexWrap="wrap" borderStyle={'round'} borderColor={'#D97D55'}>
			<Text>Something went wrong. Maybe try running the command again?</Text>
		</Box>
	);
}

const ExitComponent = () => {
		return (
		<Box width={'100%'} flexDirection="column" gap={0} paddingX={2} paddingY={1} flexWrap="wrap" borderStyle={'round'} borderColor={'#D97D55'}>
			<Text>Exiting...</Text>
		</Box>
	);
}

interface ComponentMapType {
	[key: string]: React.ComponentType | null;
}

const componentMap:ComponentMapType = {
	model: CurrentModel,
	models: ModelsInfoComponent,
	change: ChangeModelComponent,
	exit: ExitComponent
};

interface MenuProps {
	componentKey: string;
}

export default function MenuComponent ({ componentKey: componentKey }: MenuProps)  {

	const SelectedComponent = componentMap[componentKey.toLowerCase()] || DefaultComponent;

	return (
		<Box>
			<SelectedComponent />
		</Box>
	);
}