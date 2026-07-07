import { useState, useCallback } from "react";

export const useHttp = () => {
    const [status, setStatus] = useState('waiting');

    const request = useCallback(async (url: string, method = 'GET', body: null | string = null, headers = {'Content-Type': 'application/json'}) => {

        setStatus('loading');

        try {
            const response = await fetch(url, {method, body, headers});

            if (!response.ok) {
                let detail = `Could not fetch ${url}, status: ${response.status}`;
                try {
                    const errorBody = await response.json();
                    if (errorBody?.detail) detail = errorBody.detail;
                } catch {
                    // response had no JSON body; fall back to the generic message
                }
                throw new Error(detail);
            }

            const data = await response.json();

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