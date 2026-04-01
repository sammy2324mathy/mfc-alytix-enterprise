import { apiClient } from './apiClient';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface UserInfo {
  id: number;
  email: string;
  is_active: boolean;
  roles: { id: number; name: string }[];
}

export const authApi = {
  login: (data: LoginRequest) =>
    apiClient.post<TokenResponse>('/auth/login', data),

  register: (data: LoginRequest & { role_ids?: number[] }) =>
    apiClient.post<UserInfo>('/auth/register', data),

  refresh: (refresh_token: string) =>
    apiClient.post<TokenResponse>('/auth/refresh', { refresh_token }),

  me: () => apiClient.get<UserInfo>('/auth/me'),
};
