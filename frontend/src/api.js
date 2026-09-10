const defaultApiUrl = import.meta.env.PROD
	? "https://g-tec-website.onrender.com"
	: "http://localhost:5000";
const configuredApiUrl = import.meta.env.VITE_API_URL || defaultApiUrl;

export const API_BASE_URL = configuredApiUrl.replace(/\/$/, "");
export const API_BASE = `${API_BASE_URL}/api`;