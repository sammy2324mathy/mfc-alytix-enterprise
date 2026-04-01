import React from 'react';
import { Route } from 'react-router-dom';
import { MortalityPage } from './MortalityPage';
import { SurvivalPage } from './SurvivalPage';
import { PricingPage } from './PricingPage';
import { ClaimsPage } from './ClaimsPage';
import { DataExplorerPage } from './DataExplorerPage';
import { ALMPage } from './ALMPage';

export const ActuarialRoutes = () => (
  <>
    <Route path="mortality" element={<MortalityPage />} />
    <Route path="survival" element={<SurvivalPage />} />
    <Route path="pricing" element={<PricingPage />} />
    <Route path="claims" element={<ClaimsPage />} />
    <Route path="explorer" element={<DataExplorerPage />} />
    <Route path="alm" element={<ALMPage />} />
    <Route index element={<MortalityPage />} />
  </>
);
