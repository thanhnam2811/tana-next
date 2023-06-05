const { VITE_SERVER_URL } = import.meta.env;

export const API_URL = VITE_SERVER_URL;
export const MAX_RETRY = 3; // Retry count for refresh token
