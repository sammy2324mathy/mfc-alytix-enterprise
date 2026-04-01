import { apiClient } from './apiClient';

export const workspaceApi = {
  getProjects: () =>
    apiClient.get('/workspace/projects/').then(r => r.data),

  createProject: (data: { name: string; description: string; owner: string }) =>
    apiClient.post('/workspace/projects/', data).then(r => r.data),

  updateProject: (projectId: string, data: any) =>
    apiClient.put(`/workspace/projects/${projectId}`, data).then(r => r.data),

  deleteProject: (projectId: string) =>
    apiClient.delete(`/workspace/projects/${projectId}`).then(r => r.data),

  // Notifications Infrastructure
  getNotifications: (unreadOnly: boolean = false) =>
    apiClient.get('/workspace/notifications/', { params: { unread_only: unreadOnly } }).then(r => r.data),

  getNotification: (notificationId: string) =>
    apiClient.get(`/workspace/notifications/${notificationId}`).then(r => r.data),

  markNotificationRead: (notificationId: string) =>
    apiClient.put(`/workspace/notifications/${notificationId}/read`).then(r => r.data),

  deleteNotification: (notificationId: string) =>
    apiClient.delete(`/workspace/notifications/${notificationId}`).then(r => r.data),

  getUnreadCount: () =>
    apiClient.get('/workspace/notifications/count/unread').then(r => r.data),

  // Professional Activity Feed
  getActivity: (module?: string, limit: number = 20) =>
    apiClient.get('/workspace/activity/', { params: { module, limit } }).then(r => r.data),

  getActivityByUser: (user: string, limit: number = 20) =>
    apiClient.get(`/workspace/activity/by-user/${user}`, { params: { limit } }).then(r => r.data),

  getSettings: (userId: string) =>
    apiClient.get(`/workspace/settings/${userId}`).then(r => r.data),

  updateSettings: (userId: string, settings: any) =>
    apiClient.put(`/workspace/settings/${userId}`, settings).then(r => r.data),
};
