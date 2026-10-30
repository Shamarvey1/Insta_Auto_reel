import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';
const FALLBACK_URL = 'http://127.0.0.1:5000/api';

const client = axios.create({
  baseURL: API_BASE_URL,
  timeout: 45000
});

export const checkHealth = async () => {
  try {
    const res = await client.get('/health', { timeout: 4000 });
    return { connected: true, data: res.data };
  } catch (err) {
    try {
      const fallbackRes = await axios.get(`${FALLBACK_URL}/health`, { timeout: 4000 });
      return { connected: true, data: fallbackRes.data };
    } catch (fallbackErr) {
      return { connected: false, error: err.message };
    }
  }
};

export const generateScript = async (params) => {
  try {
    const res = await client.post('/reels/generate-script', params);
    return res.data;
  } catch (err) {
    try {
      const fallbackRes = await axios.post(`${FALLBACK_URL}/reels/generate-script`, params, { timeout: 45000 });
      return fallbackRes.data;
    } catch (fallbackErr) {
      const message = fallbackErr.response?.data?.error || fallbackErr.response?.data?.message || err.response?.data?.error || err.message || 'Script generation failed';
      const details = fallbackErr.response?.data?.details || err.response?.data?.details || null;
      const customError = new Error(message);
      customError.details = details;
      customError.status = fallbackErr.response?.status || err.response?.status;
      throw customError;
    }
  }
};

export default client;
