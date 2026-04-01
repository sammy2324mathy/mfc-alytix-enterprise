import React from 'react';
import { Route } from 'react-router-dom';
import { RegulationsPage } from './RegulationsPage';
import { ReportsPage } from './ReportsPage';
import { PoliciesPage } from './PoliciesPage';
import { ComplianceAuditPage } from './ComplianceAuditPage';
import { SignoffPage } from './SignoffPage';
import { RegulatoryReportingPage } from './RegulatoryReportingPage';

export const ComplianceRoutes = () => (
  <>
    <Route path="regulations" element={<RegulationsPage />} />
    <Route path="reports" element={<ReportsPage />} />
    <Route path="policies" element={<PoliciesPage />} />
    <Route path="audit" element={<ComplianceAuditPage />} />
    <Route path="signoff" element={<SignoffPage />} />
    <Route path="reporting" element={<RegulatoryReportingPage />} />
    <Route index element={<RegulationsPage />} />
  </>
);
