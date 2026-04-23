const BASE = '/api';

const FRIENDLY_ERRORS = {
  'Failed to fetch': 'Unable to reach the server. Please check your connection.',
  'NetworkError': 'A network error occurred. Please try again.',
  'Load failed': 'Unable to reach the server. Please check your connection.',
};

const sanitise = (message) => {
  for (const [key, friendly] of Object.entries(FRIENDLY_ERRORS)) {
    if (message.includes(key)) return friendly;
  }
  // Hide raw technical messages (stack traces, mongoose errors, etc.)
  if (
    message.includes('Cast to') ||
    message.includes('Cannot read') ||
    message.includes('undefined') ||
    message.includes('ECONNREFUSED') ||
    message.includes('MongoServerError')
  ) {
    return 'Something went wrong. Please try again.';
  }
  return message;
};

const handle = async (res) => {
  let data;
  try {
    data = await res.json();
  } catch {
    throw new Error('The server returned an unexpected response.');
  }
  if (!res.ok) throw new Error(sanitise(data.message || 'Request failed'));
  return data;
};

const safeFetch = (...args) =>
  fetch(...args).catch((err) => {
    throw new Error(sanitise(err.message || 'Request failed'));
  });

// Stats
export const getStats = () => safeFetch(`${BASE}/stats`).then(handle);

// Jobs
export const getJobs = () => safeFetch(`${BASE}/jobs`).then(handle);
export const getJob = (id) => safeFetch(`${BASE}/jobs/${id}`).then(handle);
export const createJob = (data) =>
  safeFetch(`${BASE}/jobs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(handle);
export const updateJob = (id, data) =>
  safeFetch(`${BASE}/jobs/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(handle);
export const deleteJob = (id) =>
  safeFetch(`${BASE}/jobs/${id}`, { method: 'DELETE' }).then(handle);

// Chat
export const sendChatMessage = (message, file, history = []) => {
  if (file) {
    const form = new FormData();
    form.append('file', file);
    if (message) form.append('message', message);
    form.append('history', JSON.stringify(history));
    return safeFetch(`${BASE}/chat`, { method: 'POST', body: form }).then(handle);
  }
  return safeFetch(`${BASE}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, history }),
  }).then(handle);
};

// Applicants
export const getAllApplicants = () =>
  safeFetch(`${BASE}/applicants/all`).then(handle);
export const getApplicants = (jobId) =>
  safeFetch(`${BASE}/applicants?jobId=${jobId}`).then(handle);
export const createApplicant = (data) =>
  safeFetch(`${BASE}/applicants/structured`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(handle);
export const uploadApplicants = (formData) =>
  safeFetch(`${BASE}/applicants/upload`, { method: 'POST', body: formData }).then(handle);
export const deleteApplicant = (id) =>
  safeFetch(`${BASE}/applicants/${id}`, { method: 'DELETE' }).then(handle);

// Screening
export const getAllScreenings = () =>
  safeFetch(`${BASE}/screening`).then(handle);
export const getScreening = (jobId) =>
  safeFetch(`${BASE}/screening/${jobId}`).then(handle);
export const runScreening = (jobId) =>
  safeFetch(`${BASE}/screening/run`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ jobId }),
  }).then(handle);