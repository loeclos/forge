import dotenv from 'dotenv';

dotenv.config({path: '.env.local', quiet: true});

/**
 * Base URL of the Forge backend server.
 *
 * Reads `MAIN_ENDPOINT` from `.env.local` and falls back to the default local
 * server address. Centralised here so every service resolves the endpoint the
 * same way instead of repeating the dotenv + env lookup.
 */
export const MAIN_ENDPOINT =
	process.env['MAIN_ENDPOINT'] ?? 'http://127.0.0.1:8000';
