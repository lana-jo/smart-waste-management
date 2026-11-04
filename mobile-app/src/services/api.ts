import { API_URL } from '../config';

const validateEmail = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
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

  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: details.toString(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || 'Gagal login');
  return data.access_token;
};

export const registerApi = async (name: string, email: string, pass: string) => {
  const trimmedName = name.trim();
  const trimmedEmail = email.trim();
  if (!trimmedName) throw new Error('Nama wajib diisi.');
  if (!validateEmail(trimmedEmail)) throw new Error('Format email tidak valid.');
  if (!pass || pass.length < 6) throw new Error('Password minimal 6 karakter.');

  const res = await fetch(`${API_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: trimmedName, email: trimmedEmail, password: pass }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || 'Gagal registrasi');
  return true;
};

export const fetchReportsApi = async (token: string) => {
  const res = await fetch(`${API_URL}/api/reports`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || 'Gagal memuat laporan');
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
  const filename = imageUri.split('/').pop() || 'photo.jpg';
  formData.append('image', {
    uri: imageUri,
    name: filename,
    type: 'image/jpeg',
  } as any);

  const res = await fetch(`${API_URL}/api/reports`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || 'Gagal mengirim laporan');
  return data;
};
