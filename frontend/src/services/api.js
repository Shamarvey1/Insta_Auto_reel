import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';
const FALLBACK_URL = 'http://127.0.0.1:5000/api';

const client = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000
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

export const fetchProvidersStatus = async () => {
  try {
    const res = await client.get('/media/providers/status');
    return res.data?.data || null;
  } catch {
    return null;
  }
};

export const createReel = async (params) => {
  try {
    const res = await client.post('/reels/generate', params);
    return res.data;
  } catch (err) {
    const message = err.response?.data?.error || err.message || 'Failed to create reel';
    const details = err.response?.data?.details || null;
    const customError = new Error(message);
    customError.details = details;
    throw customError;
  }
};

export const fetchReels = async () => {
  try {
    const res = await client.get('/reels');
    return res.data?.data || [];
  } catch {
    return [];
  }
};

export const fetchReelById = async (id) => {
  try {
    const res = await client.get(`/reels/${id}`);
    return res.data?.data || null;
  } catch {
    return null;
  }
};

export const fetchJobStatus = async (jobId) => {
  try {
    const res = await client.get(`/jobs/${jobId}`);
    return res.data?.data || null;
  } catch {
    return null;
  }
};

export default client;
