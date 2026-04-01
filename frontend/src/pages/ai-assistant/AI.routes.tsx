import React from 'react';
import { Route } from 'react-router-dom';
import { ChatPage } from './ChatPage';
import { ModelConfigPage } from './ModelConfigPage';
import { KnowledgePage } from './KnowledgePage';
import { ExperimentsPage } from './ExperimentsPage';

export const AIRoutes = () => (
  <>
    <Route path="chat" element={<ChatPage />} />
    <Route path="config" element={<ModelConfigPage />} />
    <Route path="knowledge" element={<KnowledgePage />} />
    <Route path="experiments" element={<ExperimentsPage />} />
    <Route index element={<ChatPage />} />
  </>
);
