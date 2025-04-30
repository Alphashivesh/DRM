// A simple encryption utility for the DRM system
// In a real-world implementation, this would use more robust encryption libraries

/**
 * Generates a random key of specified length
 */
export const generateKey = (length: number = 32): string => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

/**
 * Simple XOR-based encryption (for demonstration purposes only)
 * In production, use proper cryptographic libraries
 */
export const encryptData = (data: string, key: string): string => {
  let result = '';
  for (let i = 0; i < data.length; i++) {
    // XOR the character code with the key code at the corresponding position
    const charCode = data.charCodeAt(i) ^ key.charCodeAt(i % key.length);
    result += String.fromCharCode(charCode);
  }
  // Convert to base64 for safe storage
  return btoa(result);
};

/**
 * Simple XOR-based decryption (for demonstration purposes only)
 */
export const decryptData = (encryptedData: string, key: string): string => {
  try {
    // Convert from base64
    const data = atob(encryptedData);
    let result = '';
    for (let i = 0; i < data.length; i++) {
      // XOR the character code with the key code at the corresponding position
      const charCode = data.charCodeAt(i) ^ key.charCodeAt(i % key.length);
      result += String.fromCharCode(charCode);
    }
    return result;
  } catch (error) {
    console.error('Decryption failed:', error);
    return '';
  }
};

/**
 * Generate a license access key
 */
export const generateLicenseKey = (): string => {
  const segments = 4;
  const segmentLength = 5;
  let key = '';
  
  for (let i = 0; i < segments; i++) {
    key += generateKey(segmentLength);
    if (i < segments - 1) {
      key += '-';
    }
  }
  
  return key;
};

/**
 * Hash a string (simplified for demo)
 */
export const hashString = (input: string): string => {
  let hash = 0;
  if (input.length === 0) return hash.toString(16);
  
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  
  return Math.abs(hash).toString(16);
};

/**
 * Verify license validity based on various criteria
 */
export const verifyLicense = (license: any, deviceId: string): {
  valid: boolean;
  reason?: string;
} => {
  // Check if license is active
  if (!license.isActive) {
    return { valid: false, reason: 'License is not active' };
  }
  
  // Check if license has expired
  if (license.expiresAt < Date.now()) {
    return { valid: false, reason: 'License has expired' };
  }
  
  // Check usage limits if defined
  if (license.usageLimit && license.currentUsage >= license.usageLimit) {
    return { valid: false, reason: 'Usage limit exceeded' };
  }
  
  // Check for suspicious access patterns (e.g., too many different devices)
  const uniqueDevices = new Set(license.accessLog.map((log: any) => log.deviceId));
  if (uniqueDevices.size > 3 && !uniqueDevices.has(deviceId)) {
    return { valid: false, reason: 'Too many different devices' };
  }
  
  return { valid: true };
};