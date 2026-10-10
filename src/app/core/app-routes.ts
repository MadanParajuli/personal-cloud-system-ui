export const APP_ROUTES = {
  root: '/',
  home: '/home',
  experience: '/experience',
  projects: '/projects',
  publications: '/publications',
  cloud: '/cloud',
  cloudLogin: '/cloud/login',
  cloudDashboard: '/cloud/dashboard',
  cloudFiles: '/cloud/files',
  cloudStorage: '/cloud/storage',
  legacyLogin: '/login',
  legacyDashboard: '/dashboard',
} as const;

export const APP_ROUTE_SEGMENTS = {
  root: '',
  home: 'home',
  cloud: 'cloud',
  login: 'login',
  dashboard: 'dashboard',
  files: 'files',
  storage: 'storage',
  experience: 'experience',
  projects: 'projects',
  publications: 'publications',
} as const;

export const API_ENDPOINTS = {
  authLogin: '/auth/login',
  authRefresh: '/auth/refresh',
  authLogout: '/auth/logout',
  health: '/health',
  files: '/files',
  folders: '/folders',
  storage: '/storage',
} as const;