import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastProvider } from './components/ui/Toast';
import { SecurityProvider } from './context/SecurityContext';
import { EnterpriseErrorBoundary } from './components/feedback/EnterpriseErrorBoundary';
import App from './App';
import './index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const rootElement = document.getElementById('root');
if (rootElement) {
  rootElement.innerHTML = '<h1 style="color: red; font-size: 50px; text-align: center; margin-top: 100px;">CORE TERMINAL INITIALIZING...</h1>';
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <EnterpriseErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <SecurityProvider>
          <ToastProvider>
            <App />
          </ToastProvider>
        </SecurityProvider>
      </QueryClientProvider>
    </EnterpriseErrorBoundary>
  </React.StrictMode>,
);
