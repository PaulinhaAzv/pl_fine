// Tipos de usuário
export interface User {
  id: string;
  email: string;
  plano: 'basico' | 'vip' | 'admin';
  status: 'ativo' | 'inativo' | 'pago';
  canal_entrega?: 'telegram' | 'whatsapp' | 'email';
  data_compra?: string;
  preco?: number;
  is_admin?: boolean;
}

// Tipos de post
export interface Post {
  id: string;
  title: string;
  content: string;
  image_url?: string;
  description?: string;
  created_at?: string;
  likes?: number;
  user_liked?: boolean;
}

// Tipos de plano
export interface Plan {
  readonly id: string;
  readonly name: string;
  readonly price: number;
  readonly features: readonly string[];
  readonly openpixLink: string;
  readonly qrCode: string;
  readonly qrCodeImage: string;
}

// Tipos de resposta da API
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  details?: string;
}

// Tipos de webhook
export interface WebhookPayload {
  event: string;
  product_id: string;
  email: string;
  price: number;
  status: 'paid' | 'pending' | 'failed';
  transaction_id: string;
  created_at: string;
}

// Tipos de configuração
export interface AppConfig {
  appUrl: string;
  apiUrl: string;
  environment: 'development' | 'production';
}

// Tipos de estado
export interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

// Tipos de ação
export type AppAction =
  | { type: 'SET_USER'; payload: User }
  | { type: 'SET_AUTHENTICATED'; payload: boolean }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'LOGOUT' };

// Tipos de contexto
export interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

// Tipos de props comuns
export interface BaseProps {
  className?: string;
  children?: React.ReactNode;
}

// Tipos de eventos
export interface FormEvent extends React.FormEvent<HTMLFormElement> {}
export interface ChangeEvent extends React.ChangeEvent<HTMLInputElement> {}
export interface ClickEvent extends React.MouseEvent<HTMLButtonElement> {}

export interface SupabaseError {
  message: string;
  status?: number;
  name?: string;
  details?: string;
}
