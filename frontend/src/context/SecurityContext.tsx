import React, { createContext, useContext, useState } from 'react';

interface SecurityContextType {
  isMaskingActive: boolean;
  setIsMaskingActive: (active: boolean) => void;
  toggleMasking: () => void;
  maskData: (data: string) => string;
}

const SecurityContext = createContext<SecurityContextType | undefined>(undefined);

export const SecurityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMaskingActive, setIsMaskingActive] = useState(true);

  const toggleMasking = () => setIsMaskingActive(prev => !prev);

  const maskData = (data: string) => {
    if (!isMaskingActive) return data;
    if (data.length <= 4) return '****';
    return data.slice(0, 2) + '****' + data.slice(-2);
  };

  return (
    <SecurityContext.Provider value={{ isMaskingActive, setIsMaskingActive, toggleMasking, maskData }}>
      {children}
    </SecurityContext.Provider>
  );
};

export const useSecurity = () => {
  const context = useContext(SecurityContext);
  if (!context) throw new Error('useSecurity must be used within a SecurityProvider');
  return context;
};
