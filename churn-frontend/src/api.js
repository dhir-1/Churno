import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL;

export async function predict(payload) {
  const res = await axios.post(`${API_BASE}/predict`, payload);
  return res.data;
}

export async function getHistory() {
  const res = await axios.get(`${API_BASE}/predictions`);
  return res.data;
}

export async function getAnalytics() {
  const res = await axios.get(`${API_BASE}/analytics`);
  return res.data;
}

export async function uploadBatchPrediction(file) {
  const formData = new FormData();
  formData.append('file', file);

  const res = await axios.post(`${API_BASE}/predict/batch`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data;
}
