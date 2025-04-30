import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { License, AccessRecord, User } from '../types';
import { generateLicenseKey, encryptData, generateKey } from '../utils/cryptoUtils';

// Sample initial data for demonstration
const mockLicenses: License[] = [
  {
    id: '1',
    name: 'Premium Movie License',
    contentId: 'movie-001',
    contentType: 'video',
    contentName: 'Blockbuster Movie 2025',
    issuedTo: 'user1@example.com',
    issuedAt: Date.now() - 7 * 24 * 60 * 60 * 1000, // 7 days ago
    expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days from now
    isActive: true,
    accessKey: encryptData('secret-access-key-for-movie', generateKey()),
    currentUsage: 3,
    accessLog: [
      {
        timestamp: Date.now() - 5 * 24 * 60 * 60 * 1000,
        ip: '192.168.1.1',
        deviceId: 'device-001',
        granted: true,
      },
      {
        timestamp: Date.now() - 2 * 24 * 60 * 60 * 1000,
        ip: '192.168.1.2',
        deviceId: 'device-002',
        granted: true,
      },
      {
        timestamp: Date.now() - 1 * 24 * 60 * 60 * 1000,
        ip: '192.168.1.1',
        deviceId: 'device-001',
        granted: true,
      },
    ],
  },
  {
    id: '2',
    name: 'Educational Course License',
    contentId: 'course-101',
    contentType: 'document',
    contentName: 'Advanced Programming Course',
    issuedTo: 'user1@example.com',
    issuedAt: Date.now() - 30 * 24 * 60 * 60 * 1000, // 30 days ago
    expiresAt: Date.now() - 1 * 24 * 60 * 60 * 1000, // expired 1 day ago
    isActive: false,
    accessKey: encryptData('secret-access-key-for-course', generateKey()),
    currentUsage: 10,
    usageLimit: 15,
    accessLog: [
      {
        timestamp: Date.now() - 25 * 24 * 60 * 60 * 1000,
        ip: '192.168.1.1',
        deviceId: 'device-001',
        granted: true,
      },
      {
        timestamp: Date.now() - 2 * 24 * 60 * 60 * 1000,
        ip: '192.168.1.1',
        deviceId: 'device-001',
        granted: false,
        reason: 'License expired',
      },
    ],
  },
];

// Sample user for demonstration
const mockUser: User = {
  id: '1',
  name: 'Shivesh kumar',
  email: 'user1@example.com',
  role: 'subscriber',
};

interface LicenseContextType {
  licenses: License[];
  currentUser: User | null;
  addLicense: (license: Omit<License, 'id' | 'issuedAt' | 'accessKey' | 'accessLog' | 'currentUsage'>) => void;
  activateLicense: (licenseId: string) => void;
  deactivateLicense: (licenseId: string) => void;
  renewLicense: (licenseId: string, durationDays: number) => void;
  requestAccess: (licenseId: string, deviceId: string, ip: string) => { granted: boolean; reason?: string };
  switchUserRole: () => void;
}

const LicenseContext = createContext<LicenseContextType | undefined>(undefined);

export const useLicenses = () => {
  const context = useContext(LicenseContext);
  if (!context) {
    throw new Error('useLicenses must be used within a LicenseProvider');
  }
  return context;
};

export const LicenseProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [licenses, setLicenses] = useState<License[]>(mockLicenses);
  const [currentUser, setCurrentUser] = useState<User | null>(mockUser);

  // Generate a device ID for the current browser session
  const [deviceId] = useState<string>(() => {
    const storedId = localStorage.getItem('drm-device-id');
    if (storedId) return storedId;
    
    const newId = `device-${Math.random().toString(36).substring(2, 9)}`;
    localStorage.setItem('drm-device-id', newId);
    return newId;
  });

  // Add a new license
  const addLicense = (licenseData: Omit<License, 'id' | 'issuedAt' | 'accessKey' | 'accessLog' | 'currentUsage'>) => {
    const newLicense: License = {
      ...licenseData,
      id: `license-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 9)}`,
      issuedAt: Date.now(),
      accessKey: encryptData(`access-key-${licenseData.contentId}`, generateLicenseKey()),
      accessLog: [],
      currentUsage: 0,
    };
    
    setLicenses(prev => [...prev, newLicense]);
  };

  // Activate a license
  const activateLicense = (licenseId: string) => {
    setLicenses(prev => 
      prev.map(license => 
        license.id === licenseId 
          ? { ...license, isActive: true } 
          : license
      )
    );
  };

  // Deactivate a license
  const deactivateLicense = (licenseId: string) => {
    setLicenses(prev => 
      prev.map(license => 
        license.id === licenseId 
          ? { ...license, isActive: false } 
          : license
      )
    );
  };

  // Renew a license
  const renewLicense = (licenseId: string, durationDays: number) => {
    setLicenses(prev => 
      prev.map(license => 
        license.id === licenseId 
          ? { 
              ...license, 
              expiresAt: Date.now() + durationDays * 24 * 60 * 60 * 1000,
              isActive: true
            } 
          : license
      )
    );
  };

  // Request access to content
  const requestAccess = (licenseId: string, deviceId: string, ip: string) => {
    const license = licenses.find(l => l.id === licenseId);
    
    if (!license) {
      return { granted: false, reason: 'License not found' };
    }

    // Check if license is active
    if (!license.isActive) {
      const accessRecord: AccessRecord = {
        timestamp: Date.now(),
        ip,
        deviceId,
        granted: false,
        reason: 'License is not active',
      };
      
      // Update access log
      setLicenses(prev => 
        prev.map(l => 
          l.id === licenseId 
            ? { ...l, accessLog: [...l.accessLog, accessRecord] } 
            : l
        )
      );
      
      return { granted: false, reason: 'License is not active' };
    }

    // Check if license has expired
    if (license.expiresAt < Date.now()) {
      const accessRecord: AccessRecord = {
        timestamp: Date.now(),
        ip,
        deviceId,
        granted: false,
        reason: 'License has expired',
      };
      
      // Update access log
      setLicenses(prev => 
        prev.map(l => 
          l.id === licenseId 
            ? { ...l, accessLog: [...l.accessLog, accessRecord] } 
            : l
        )
      );
      
      return { granted: false, reason: 'License has expired' };
    }

    // Check usage limits if defined
    if (license.usageLimit && license.currentUsage >= license.usageLimit) {
      const accessRecord: AccessRecord = {
        timestamp: Date.now(),
        ip,
        deviceId,
        granted: false,
        reason: 'Usage limit exceeded',
      };
      
      // Update access log
      setLicenses(prev => 
        prev.map(l => 
          l.id === licenseId 
            ? { ...l, accessLog: [...l.accessLog, accessRecord] } 
            : l
        )
      );
      
      return { granted: false, reason: 'Usage limit exceeded' };
    }

    // Grant access and update usage counters
    const accessRecord: AccessRecord = {
      timestamp: Date.now(),
      ip,
      deviceId,
      granted: true,
    };
    
    setLicenses(prev => 
      prev.map(l => 
        l.id === licenseId 
          ? { 
              ...l, 
              currentUsage: l.currentUsage + 1,
              accessLog: [...l.accessLog, accessRecord],
            } 
          : l
      )
    );
    
    return { granted: true };
  };

  // Toggle between provider and subscriber roles for demonstration
  const switchUserRole = () => {
    if (currentUser) {
      setCurrentUser({
        ...currentUser,
        role: currentUser.role === 'provider' ? 'subscriber' : 'provider'
      });
    }
  };

  return (
    <LicenseContext.Provider 
      value={{ 
        licenses, 
        currentUser,
        addLicense, 
        activateLicense, 
        deactivateLicense, 
        renewLicense, 
        requestAccess,
        switchUserRole
      }}
    >
      {children}
    </LicenseContext.Provider>
  );
};
