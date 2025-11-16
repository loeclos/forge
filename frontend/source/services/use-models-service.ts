import dotenv from 'dotenv';
import {useHttp} from '../hooks/http.hook.js';

dotenv.config({path: '.env.local', quiet: true});

export default function useModelService() {
	const {request, clearError, status, setStatus} = useHttp();

	const getCurrentModel = async () => {
		const res = await request(
			`${process.env['MAIN_ENDPOINT']}/api/models/current`,
		);

		return res;
	};

	const getAllModels = async () => {
		const res = await request(
			`${process.env['MAIN_ENDPOINT']}/api/models/all`,
		);

		return res;
	};

	const setCurrentModel = async (modelName: string) => {
		const res = await request(
			`${process.env['MAIN_ENDPOINT']}/api/models/change`,
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
