import { API_URL } from '../config';

// Batas tunggu 15 detik; tidak ada request yang infinite hang.
const TIMEOUT_MS = 15000;
const TIMEOUT_MSG = 'Koneksi lambat atau server tidak menjawab. Coba lagi.';
const NET_MSG = 'Tidak bisa terhubung ke server. Periksa koneksi internet.';

const normalizeFetchError = (e: unknown): Error => {
  if (e instanceof Error) {
    // RN 0.88: AbortSignal.timeout memicu DOMException ber-name 'TimeoutError'.
    if (e.name === 'TimeoutError' || e.name === 'AbortError') return new Error(TIMEOUT_MSG);
    if (e.name === 'TypeError') return new Error(NET_MSG);
    return e;
  }
  return new Error(NET_MSG);
};

export const fetchWithTimeout = (url: string, options: RequestInit = {}) => {
  return fetch(url, { ...options, signal: AbortSignal.timeout(TIMEOUT_MS) }).catch((e) => {
    throw normalizeFetchError(e);
  });
};

const validateEmail = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const handleResponse = async (res: Response, defaultError: string) => {
  const contentType = res.headers.get('content-type');
  if (!contentType || !contentType.includes('application/json')) {
    throw new Error(`Akses diblokir server/Cloudflare (Status ${res.status}).`);
  }
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || defaultError);
  return data;
};

export const loginApi = async (email: string, pass: string) => {
  const trimmedEmail = email.trim();
  if (!validateEmail(trimmedEmail)) {
    throw new Error('Format email tidak valid.');
  }
  if (!pass || pass.length < 6) {
    throw new Error('Password minimal 6 karakter.');
  }

  const details = new URLSearchParams();
  details.append('username', trimmedEmail);
  details.append('password', pass);

  const res = await fetchWithTimeout(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: details.toString(),
  });
  const data = await handleResponse(res, 'Gagal login');
  return data.access_token;
};

export const registerApi = async (name: string, email: string, pass: string) => {
  const trimmedName = name.trim();
  const trimmedEmail = email.trim();
  if (!trimmedName) throw new Error('Nama wajib diisi.');
  if (!validateEmail(trimmedEmail)) throw new Error('Format email tidak valid.');
  if (!pass || pass.length < 6) throw new Error('Password minimal 6 karakter.');

  const res = await fetchWithTimeout(`${API_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: trimmedName, email: trimmedEmail, password: pass }),
  });
  await handleResponse(res, 'Gagal registrasi');
  return true;
};

export const fetchReportsApi = async (token: string) => {
  const res = await fetchWithTimeout(`${API_URL}/api/reports`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  const data = await handleResponse(res, 'Gagal memuat laporan');
  return data.items || [];
};

export const submitReportApi = async (token: string, imageUri: string, description: string, location: any, prediction: any) => {
  const formData = new FormData();
  formData.append('description', description || 'Laporan sampah mobile');
  if (location) {
    formData.append('latitude', location.coords.latitude.toString());
    formData.append('longitude', location.coords.longitude.toString());
  }
  if (prediction) {
    formData.append('category', prediction.predicted_class);
    formData.append('confidence', prediction.confidence.toString());
  }
  const rawFilename = imageUri.split('/').pop() || 'photo.jpg';
  const filename = /\.[a-zA-Z0-9]+$/.test(rawFilename)
    ? rawFilename
    : `${rawFilename}.jpg`;
  formData.append('image', {
    uri: imageUri,
    name: filename,
    type: 'image/jpeg',
  } as any);

  const res = await fetchWithTimeout(`${API_URL}/api/reports`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });

  const data = await handleResponse(res, 'Gagal mengirim laporan');
  return data;
};

export const predictWasteApi = async (token: string, imageUri: string) => {
  const formData = new FormData();
  const rawFilename = imageUri.split('/').pop() || 'photo.jpg';
  const filename = /\.[a-zA-Z0-9]+$/.test(rawFilename)
    ? rawFilename
    : `${rawFilename}.jpg`;
  formData.append('file', {
    uri: imageUri,
    name: filename,
    type: 'image/jpeg',
  } as any);

  const res = await fetchWithTimeout(`${API_URL}/api/ml/predict`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });

  const data = await handleResponse(res, 'Gagal klasifikasi sampah');
  return data;
};
