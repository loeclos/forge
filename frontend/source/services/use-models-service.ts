import {useHttp} from '../hooks/http.hook.js';
import {MAIN_ENDPOINT} from '../config.js';

export default function useModelService() {
	const {request, clearError, status, setStatus} = useHttp();

	const getCurrentModel = async () => {
		const res = await request(`${MAIN_ENDPOINT}/api/models/current`);

		return res;
	};

	const getAllModels = async () => {
		const res = await request(`${MAIN_ENDPOINT}/api/models/all`);

		return res;
	};

	const setCurrentModel = async (modelName: string) => {
		const res = await request(
			`${MAIN_ENDPOINT}/api/models/change`,
			'POST',
			JSON.stringify({model_name: modelName}),
			{
				'Content-Type': 'application/json',
			},
		);

		return res;
	};

	return {
		getCurrentModel,
		getAllModels,
		setCurrentModel,
		clearError,
		status,
		setStatus,
	};
}
