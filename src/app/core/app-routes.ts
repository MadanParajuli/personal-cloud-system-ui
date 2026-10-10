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

export const APP_ROUTES = {
  root: '/',
  home: `/${APP_ROUTE_SEGMENTS.home}`,
  experience: `/${APP_ROUTE_SEGMENTS.experience}`,
  projects: `/${APP_ROUTE_SEGMENTS.projects}`,
  publications: `/${APP_ROUTE_SEGMENTS.publications}`,
  cloud: `/${APP_ROUTE_SEGMENTS.cloud}`,
  cloudLogin: `/${APP_ROUTE_SEGMENTS.cloud}/${APP_ROUTE_SEGMENTS.login}`,
  cloudDashboard: `/${APP_ROUTE_SEGMENTS.cloud}/${APP_ROUTE_SEGMENTS.dashboard}`,
  cloudFiles: `/${APP_ROUTE_SEGMENTS.cloud}/${APP_ROUTE_SEGMENTS.files}`,
  cloudStorage: `/${APP_ROUTE_SEGMENTS.cloud}/${APP_ROUTE_SEGMENTS.storage}`,
  legacyLogin: `/${APP_ROUTE_SEGMENTS.login}`,
  legacyDashboard: `/${APP_ROUTE_SEGMENTS.dashboard}`,
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