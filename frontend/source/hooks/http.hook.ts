import { useState, useCallback } from "react";

export const useHttp = () => {
    const [status, setStatus] = useState('waiting');

    const request = useCallback(async (url: string, method = 'GET', body: null | string = null, headers = {'Content-Type': 'application/json'}) => {

        setStatus('loading');

        try {
            const response = await fetch(url, {method, body, headers});

            if (!response.ok) {
                throw new Error(`Could not fetch ${url}, status: ${response.status}`);
            }

            const data = await response.json();

            if (data.status_code === 500) {
                throw new Error(data.detail);
            }

            return data;
        } catch(e) {
            setStatus('error');
            throw e;
        }
    }, []);

    const clearError = useCallback(() => {
        setStatus('loading');
    }, []);

    return {request, clearError, status, setStatus}
}