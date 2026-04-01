import React from 'react';
import { Route } from 'react-router-dom';
import { UsersPage } from './UsersPage';
import { RolesPage } from './RolesPage';
import { ControlCenter } from './ControlCenter';
import { AuditPage } from './AuditPage';
import { SettingsPage } from './SettingsPage';

export const AdminRoutes = () => (
  <>
    <Route path="users" element={<UsersPage />} />
    <Route path="roles" element={<RolesPage />} />
    <Route path="control-center" element={<ControlCenter />} />
    <Route path="audit" element={<AuditPage />} />
    <Route path="settings" element={<SettingsPage />} />
    <Route index element={<ControlCenter />} />
  </>
);
