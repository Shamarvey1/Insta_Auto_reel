import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';
const FALLBACK_URL = 'http://127.0.0.1:5000/api';

const client = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000
});

export const checkHealth = async () => {
  try {
    const res = await client.get('/health');
    return { connected: true, data: res.data };
  } catch (err) {
    try {
      const fallbackRes = await axios.get(`${FALLBACK_URL}/health`, { timeout: 3000 });
      return { connected: true, data: fallbackRes.data };
    } catch (fallbackErr) {
      return { connected: false, error: err.message };
    }
  }
};

export default client;

