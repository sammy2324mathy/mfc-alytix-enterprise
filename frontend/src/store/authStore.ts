import { create } from 'zustand';

interface User {
  sub: string; // user ID
  roles: string[];
}

interface AuthState {
  token: string | null;
  refreshToken: string | null;
  user: User | null;
  setTokens: (accessToken: string, refreshToken: string) => void;
  logout: () => void;
}

const decodeToken = (token: string): User | null => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    const payload = JSON.parse(atob(parts[1]));
    
    // Check if token is expired
    if (payload.exp && Date.now() >= payload.exp * 1000) {
      return null;
    }
    
    return {
      sub: payload.sub,
      roles: payload.roles || []
    };
  } catch (error) {
    return null;
  }
};

export const useAuthStore = create<AuthState>((set, get) => {
  const initialToken = localStorage.getItem('access_token');
  const initialRefreshToken = localStorage.getItem('refresh_token');
  const initialUser = initialToken ? decodeToken(initialToken) : null;

  // Clean up invalid tokens on load
  if (initialToken && !initialUser) {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }

  return {
    token: initialUser ? initialToken : null,
    refreshToken: initialUser ? initialRefreshToken : null,
    user: initialUser,
    setTokens: (accessToken: string, refreshToken: string) => {
      const user = decodeToken(accessToken);
      if (!user) {
        // Invalid token, don't store it
        get().logout();
        return;
      }
      localStorage.setItem('access_token', accessToken);
      localStorage.setItem('refresh_token', refreshToken);
      set({ token: accessToken, refreshToken, user });
    },
    logout: () => {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      set({ token: null, refreshToken: null, user: null });
    }
  };
});
