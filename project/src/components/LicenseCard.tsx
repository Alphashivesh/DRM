import React, { useState } from 'react';
import { Shield, Clock, CheckCircle, XCircle, FileText, Film, Music, Package } from 'lucide-react';
import { License } from '../types';
import { useLicenses } from '../context/LicenseContext';

interface LicenseCardProps {
  license: License;
  showActions?: boolean;
}

const LicenseCard: React.FC<LicenseCardProps> = ({ license, showActions = true }) => {
  const { activateLicense, deactivateLicense, renewLicense, requestAccess } = useLicenses();
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<{ granted: boolean; reason?: string } | null>(null);
  
  // Format date
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };
  
  // Handle access request
  const handleAccessRequest = () => {
    setIsVerifying(true);
    
    // Simulate a verification process
    setTimeout(() => {
      const deviceId = localStorage.getItem('drm-device-id') || 'unknown-device';
      const result = requestAccess(license.id, deviceId, '127.0.0.1');
      setVerificationResult(result);
      
      // Reset after 3 seconds
      setTimeout(() => {
        setIsVerifying(false);
        setVerificationResult(null);
      }, 3000);
    }, 1500);
  };
  
  // Determine if license is expired
  const isExpired = license.expiresAt < Date.now();
  
  // Select content type icon
  const ContentIcon = () => {
    switch (license.contentType) {
      case 'video':
        return <Film className="h-5 w-5 text-blue-400" />;
      case 'audio':
        return <Music className="h-5 w-5 text-purple-400" />;
      case 'document':
        return <FileText className="h-5 w-5 text-yellow-400" />;
      case 'software':
        return <Package className="h-5 w-5 text-green-400" />;
      default:
        return <FileText className="h-5 w-5 text-gray-400" />;
    }
  };
  
  return (
    <div className={`bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-all duration-300 ${
      isVerifying ? 'border-2 border-yellow-500' : 
      verificationResult ? (verificationResult.granted ? 'border-2 border-green-500' : 'border-2 border-red-500') :
      'border border-gray-700 hover:border-gray-600'
    }`}>
      <div className="p-5">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center">
            <ContentIcon />
            <h3 className="text-lg font-semibold text-white ml-2">{license.name}</h3>
          </div>
          <div className={`flex items-center px-2 py-1 rounded-full text-xs font-medium ${
            license.isActive && !isExpired ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'
          }`}>
            {license.isActive && !isExpired ? (
              <>
                <CheckCircle className="h-3 w-3 mr-1" />
                <span>Active</span>
              </>
            ) : (
              <>
                <XCircle className="h-3 w-3 mr-1" />
                <span>{isExpired ? 'Expired' : 'Inactive'}</span>
              </>
            )}
          </div>
        </div>
        
        <p className="text-gray-400 mb-3 text-sm">
          Content: <span className="text-white">{license.contentName}</span>
        </p>
        
        <div className="flex justify-between mb-4">
          <div className="flex items-center text-xs text-gray-400">
            <Clock className="h-4 w-4 mr-1" />
            <span>Issued: {formatDate(license.issuedAt)}</span>
          </div>
          <div className="flex items-center text-xs text-gray-400">
            <Clock className="h-4 w-4 mr-1" />
            <span>Expires: {formatDate(license.expiresAt)}</span>
          </div>
        </div>
        
        {license.usageLimit && (
          <div className="mb-4">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-400">Usage:</span>
              <span className={`font-medium ${
                license.currentUsage >= license.usageLimit ? 'text-red-400' : 'text-blue-400'
              }`}>
                {license.currentUsage} / {license.usageLimit}
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${
                  license.currentUsage >= license.usageLimit ? 'bg-red-500' : 'bg-blue-500'
                }`}
                style={{ width: `${Math.min(100, (license.currentUsage / license.usageLimit) * 100)}%` }}
              ></div>
            </div>
          </div>
        )}
        
        {/* Verification animation */}
        {isVerifying && (
          <div className="flex justify-center items-center my-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-yellow-500"></div>
            <span className="ml-2 text-yellow-500">Verifying license...</span>
          </div>
        )}
        
        {/* Verification result */}
        {verificationResult && (
          <div className={`my-3 p-2 rounded-md text-sm ${
            verificationResult.granted ? 'bg-green-900/50 text-green-300' : 'bg-red-900/50 text-red-300'
          }`}>
            {verificationResult.granted ? (
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 mr-2" />
                <span>Access granted</span>
              </div>
            ) : (
              <div className="flex items-center">
                <XCircle className="h-4 w-4 mr-2" />
                <span>Access denied: {verificationResult.reason}</span>
              </div>
            )}
          </div>
        )}
        
        {showActions && (
          <div className="flex justify-between mt-4 pt-4 border-t border-gray-700">
            {license.isActive ? (
              <button 
                onClick={() => deactivateLicense(license.id)}
                className="px-3 py-1.5 bg-red-800 hover:bg-red-700 text-white text-sm rounded-md transition-colors"
              >
                Deactivate
              </button>
            ) : (
              <button 
                onClick={() => activateLicense(license.id)}
                className="px-3 py-1.5 bg-green-800 hover:bg-green-700 text-white text-sm rounded-md transition-colors"
              >
                Activate
              </button>
            )}
            
            <button 
              onClick={handleAccessRequest}
              className="px-3 py-1.5 bg-blue-800 hover:bg-blue-700 text-white text-sm rounded-md transition-colors flex items-center"
            >
              <Shield className="h-4 w-4 mr-1" />
              Verify Access
            </button>
            
            {isExpired && (
              <button 
                onClick={() => renewLicense(license.id, 30)}
                className="px-3 py-1.5 bg-purple-800 hover:bg-purple-700 text-white text-sm rounded-md transition-colors"
              >
                Renew (30 Days)
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LicenseCard;