import React from 'react';
import { Route } from 'react-router-dom';
import { PolicyEnrollmentPage } from './PolicyEnrollmentPage';
import { PolicyManagementPage } from './PolicyManagementPage';
import { ClaimsManagementPage } from './ClaimsManagementPage';
import { PolicyAnalyticsPage } from './PolicyAnalyticsPage';

export const InsuranceRoutes = () => (
  <>
    <Route path="enroll" element={<PolicyEnrollmentPage />} />
    <Route path="policies" element={<PolicyManagementPage />} />
    <Route path="claims" element={<ClaimsManagementPage />} />
    <Route path="analytics" element={<PolicyAnalyticsPage />} />
    <Route index element={<PolicyManagementPage />} />
  </>
);
