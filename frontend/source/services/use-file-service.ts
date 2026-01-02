import dotenv from 'dotenv';
import {useHttp} from '../hooks/http.hook.js';

dotenv.config({path: '.env.local', quiet: true});

interface CwdResponse {
    dir: string | undefined;
    message: string | undefined;
}

export default function useFileService() {
    const {request, clearError, status, setStatus} = useHttp();


    const changeCWD = async (newDir: string) => {
	    await request(`${process.env['MAIN_ENDPOINT']}/api/utils/change_cwd`, 
            'POST',
            JSON.stringify({path: newDir}),
            {'Content-Type': 'application/json'},
        );
    };

    const fetchCwd = async (): Promise<CwdResponse> => {
        const response = await fetch(`${process.env['MAIN_ENDPOINT']}/api/utils/getcwd`);
        const data: CwdResponse = await response.json();
        return data;
	};

    return {
		fetchCwd,
        changeCWD,
		clearError,
		status,
		setStatus,
	};
};
