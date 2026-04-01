import React from 'react';
import { Route } from 'react-router-dom';
import { DSDataPage } from './DSDataPage';
import { DSGovernancePage } from './DSGovernancePage';
import { DSDashboardsPage } from './DSDashboardsPage';
import { DSDeploymentPage } from './DSDeploymentPage';

export const DataScienceRoutes = () => (
  <>
    <Route path="data" element={<DSDataPage />} />
    <Route path="governance" element={<DSGovernancePage />} />
    <Route path="dashboards" element={<DSDashboardsPage />} />
    <Route path="deployment" element={<DSDeploymentPage />} />
    <Route index element={<DSDataPage />} />
  </>
);
