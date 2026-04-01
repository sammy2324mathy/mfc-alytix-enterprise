import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { FullPageLoader } from './LoadingSpinner';

export const RouteLoader: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 300); // Minimum 300ms loader
    return () => clearTimeout(timer);
  }, [location.pathname]);

  if (isLoading) {
    return <FullPageLoader text="Loading page..." />;
  }

  return <>{children}</>;
};
