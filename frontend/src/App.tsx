import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SecurityProvider } from './context/SecurityContext';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ErrorBoundary } from './components/ui/ErrorBoundary';
import { RouteLoader } from './components/ui/RouteLoader';
import { AuthHealthCheck } from './components/auth/AuthHealthCheck';
import { NetworkStatus } from './components/ui/NetworkStatus';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/auth/ResetPasswordPage';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './pages/dashboard/Dashboard';
import { useAuthStore } from './store/authStore';
import { AILayout } from './pages/ai-assistant/AILayout';
import { RiskLayout } from './pages/risk/RiskLayout';
import { FinancialsLayout } from './pages/financials/FinancialsLayout';
import { ComplianceLayout } from './pages/compliance/ComplianceLayout';
import { DataScienceLayout } from './pages/data-science/DataScienceLayout';
import { AdminLayout } from './pages/admin/AdminLayout';
import { SovereignSecurity } from './pages/security/SovereignSecurity';
import { IntegratedDashboard } from './pages/dashboard/IntegratedDashboard';
import { AutonomousHub } from './pages/autonomous/AutonomousHub';
import { ActuarialLayout } from './pages/actuarial/ActuarialLayout';
import { InsuranceLayout } from './pages/insurance/InsuranceLayout';

// Modular Route Imports
import { AIRoutes } from './pages/ai-assistant/AI.routes';
import { RiskRoutes } from './pages/risk/Risk.routes';
import { ActuarialRoutes } from './pages/actuarial/Actuarial.routes';
import { FinancialsRoutes } from './pages/financials/Financials.routes';
import { ComplianceRoutes } from './pages/compliance/Compliance.routes';
import { DataScienceRoutes } from './pages/data-science/DataScience.routes';
import { AdminRoutes } from './pages/admin/Admin.routes';
import { InsuranceRoutes } from './pages/insurance/Insurance.routes';

// Enhanced protected route wrapper with RBAC
export const ProtectedRoute = ({ children, allowedRoles }: { children: React.ReactNode, allowedRoles?: string[] }) => {
  const { token, user } = useAuthStore();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && allowedRoles.length > 0) {
    const hasRole = user?.roles.some(r => allowedRoles.includes(r) || r === 'admin');
    if (!hasRole) {
      // Redirect to unauthorized or dashboard
      return <Navigate to="/dashboard" replace />;
    }
  }

  return <>{children}</>;
};

const queryClient = new QueryClient();

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <SecurityProvider>
          <BrowserRouter>
            <NetworkStatus />
            <RouteLoader>
              <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />

            {/* Protected Dashboard Routes */}
            <Route path="/" element={
              <ProtectedRoute>
                <AuthHealthCheck>
                  <Layout />
                </AuthHealthCheck>
              </ProtectedRoute>
            }>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="integrated-dashboard" element={<IntegratedDashboard />} />
              <Route path="autonomous-hub" element={<AutonomousHub />} />
              <Route path="accounting" element={
                <ProtectedRoute allowedRoles={['junior_accountant', 'chief_accountant']}>
                  <FinancialsLayout />
                </ProtectedRoute>
              }>
                {FinancialsRoutes()}
              </Route>

              <Route path="risk" element={
                <ProtectedRoute allowedRoles={['risk_analyst', 'cro', 'actuary', 'actuarial_analyst', 'chief_actuary']}>
                  <RiskLayout />
                </ProtectedRoute>
              }>
                {RiskRoutes()}
              </Route>

              <Route path="actuarial" element={
                <ProtectedRoute allowedRoles={['actuary', 'actuarial_analyst', 'chief_actuary']}>
                  <ActuarialLayout />
                </ProtectedRoute>
              }>
                {ActuarialRoutes()}
              </Route>

              <Route path="security" element={
                <ProtectedRoute allowedRoles={['admin', 'cro']}>
                  <SovereignSecurity />
                </ProtectedRoute>
              } />

              <Route path="ai" element={
                <ProtectedRoute allowedRoles={['data_scientist', 'actuarial_analyst', 'chief_actuary', 'actuary', 'risk_analyst', 'cro', 'junior_accountant', 'chief_accountant', 'compliance_officer', 'chief_compliance_officer']}>
                  <AILayout />
                </ProtectedRoute>
              }>
                {AIRoutes()}
              </Route>

              <Route path="compliance" element={
                <ProtectedRoute allowedRoles={['compliance_officer', 'chief_compliance_officer']}>
                  <ComplianceLayout />
                </ProtectedRoute>
              }>
                {ComplianceRoutes()}
              </Route>

              <Route path="data-science" element={
                <ProtectedRoute allowedRoles={['data_scientist']}>
                  <DataScienceLayout />
                </ProtectedRoute>
              }>
                {DataScienceRoutes()}
              </Route>

              <Route path="insurance" element={
                <ProtectedRoute allowedRoles={['junior_accountant', 'chief_accountant', 'actuary', 'actuarial_analyst', 'chief_actuary']}>
                  <InsuranceLayout />
                </ProtectedRoute>
              }>
                {InsuranceRoutes()}
              </Route>

              <Route path="admin" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminLayout />
                </ProtectedRoute>
              }>
                {AdminRoutes()}
              </Route>
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
            </RouteLoader>
          </BrowserRouter>
        </SecurityProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
