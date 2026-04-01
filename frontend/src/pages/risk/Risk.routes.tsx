import React from 'react';
import { Route } from 'react-router-dom';
import { MetricsPage } from './MetricsPage';
import { SimulationsPage } from './SimulationsPage';
import { StressTestsPage } from './StressTestsPage';
import { RiskCalibration } from './RiskCalibration';
import { CapitalPage } from './CapitalPage';
import { RiskAppetitePage } from './RiskAppetitePage';
import { ReverseStressPage } from './ReverseStressPage';
import { ReinsurancePage } from './ReinsurancePage';

export const RiskRoutes = () => (
  <>
    <Route path="metrics" element={<MetricsPage />} />
    <Route path="simulations" element={<SimulationsPage />} />
    <Route path="stress-tests" element={<StressTestsPage />} />
    <Route path="calibration" element={<RiskCalibration />} />
    <Route path="capital" element={<CapitalPage />} />
    <Route path="appetite" element={<RiskAppetitePage />} />
    <Route path="reverse-stress" element={<ReverseStressPage />} />
    <Route path="reinsurance" element={<ReinsurancePage />} />
    <Route index element={<MetricsPage />} />
  </>
);
