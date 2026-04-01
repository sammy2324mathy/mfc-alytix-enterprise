import React, { useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { financialApi } from '../../services/financialApi';

interface AuthHealthCheckProps {
  children: React.ReactNode;
}

export const AuthHealthCheck: React.FC<AuthHealthCheckProps> = ({ children }) => {
  const { token, user, logout } = useAuthStore();

  useEffect(() => {
    // Periodic token validation
    if (token && user) {
      const checkToken = async () => {
        try {
          // Make a lightweight request to validate token
          await financialApi.getCustomers();
        } catch (error) {
          console.warn('Token validation failed, logging out');
          logout();
        }
      };

      // Check token every 5 minutes
      const interval = setInterval(checkToken, 5 * 60 * 1000);
      
      return () => clearInterval(interval);
    }
  }, [token, user, logout]);

  useEffect(() => {
    // Warn if token is about to expire (within 5 minutes)
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const expirationTime = payload.exp * 1000;
        const currentTime = Date.now();
        const timeUntilExpiry = expirationTime - currentTime;
        
        if (timeUntilExpiry < 5 * 60 * 1000 && timeUntilExpiry > 0) {
          console.warn('Token will expire soon, consider refreshing');
        }
      } catch (error) {
        console.warn('Failed to parse token for expiration check');
      }
    }
  }, [token]);

  return <>{children}</>;
};
