export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  expiresInSeconds: number;
}

export interface RefreshRequest {
  refreshToken: string;
}

export interface FileItem {
  id: string;
  name: string;
  type: 'file';
  size: number;
  contentType: string;
  modifiedAt: string;
  path: string;
}

export interface FolderItem {
  id: string;
  name: string;
  type: 'folder';
  modifiedAt: string;
  path: string;
}

export interface ApiError {
  timestamp?: string;
  status?: number;
  error?: string;
  message?: string;
}

export interface HealthResponse {
  status: string;
}

export interface StorageInfo {
  totalBytes: number;
  usedBytes: number;
  freeBytes: number;
  usedPercentage: number;
}
