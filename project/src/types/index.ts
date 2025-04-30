export type ContentType = 'video' | 'audio' | 'document' | 'software';

export interface License {
  id: string;
  name: string;
  contentId: string;
  contentType: ContentType;
  contentName: string;
  issuedTo: string;
  issuedAt: number;
  expiresAt: number;
  isActive: boolean;
  accessKey: string; // Encrypted access key
  usageLimit?: number;
  currentUsage: number;
  accessLog: AccessRecord[];
}

export interface AccessRecord {
  timestamp: number;
  ip: string;
  deviceId: string;
  granted: boolean;
  reason?: string;
}

export interface EncryptionKey {
  id: string;
  key: string;
  algorithm: string;
  createdAt: number;
  expiresAt: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'provider' | 'subscriber';
}