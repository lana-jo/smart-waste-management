export type AuthMode = 'login' | 'register' | 'app';
export type ActiveTab = 'create' | 'list';

export interface Prediction {
  predicted_class: string;
  confidence: number;
}

export interface ReportItem {
  id: string;
  category: string;
  description?: string;
  status: string;
  created_at: string;
  image_url: string;
  latitude: number;
  longitude: number;
  confidence: number;
}
