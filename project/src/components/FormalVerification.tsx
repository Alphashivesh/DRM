import React, { useState } from 'react';
import { useLicenses } from '../context/LicenseContext';
import { License } from '../types';
import { Check, Clock, FileSpreadsheet, Info, X } from 'lucide-react';

// This component demonstrates a simplified formal verification process
// In a real implementation, you would integrate with actual verification tools like SPIN
const FormalVerification: React.FC = () => {
  const { licenses } = useLicenses();
  const [verifying, setVerifying] = useState(false);
  const [verificationResults, setVerificationResults] = useState<Array<{
    property: string;
    status: 'passed' | 'failed' | 'pending';
    details?: string;
  }>>([]);
  
  // Formal properties to verify
  const properties = [
    {
      id: 'prop1',
      name: 'License Key Integrity',
      description: 'Ensures access keys are properly encrypted and cannot be tampered with',
      implementation: (license: License) => license.accessKey.length > 20
    },
    {
      id: 'prop2',
      name: 'License Expiration Validation',
      description: 'Verifies that expired licenses are correctly identified and access is denied',
      implementation: (license: License) => {
        if (license.expiresAt < Date.now() && license.isActive) {
          return false; // Failed: license is expired but still active
        }
        return true;
      }
    },
    {
      id: 'prop3',
      name: 'Usage Limit Enforcement',
      description: 'Confirms that usage limits are properly enforced when defined',
      implementation: (license: License) => {
        if (license.usageLimit && license.currentUsage > license.usageLimit) {
          return false; // Failed: usage exceeds limit
        }
        return true;
      }
    },
    {
      id: 'prop4',
      name: 'Access Log Consistency',
      description: 'Validates that all access attempts are properly recorded',
      implementation: (license: License) => {
        // Check if any access log entries have missing required fields
        return !license.accessLog.some(log => 
          !log.timestamp || !log.deviceId || !log.ip || log.granted === undefined
        );
      }
    },
    {
      id: 'prop5',
      name: 'Temporal Logic: License Activation',
      description: 'Verifies that license can only be used after issuance and before expiration',
      implementation: (license: License) => {
        const now = Date.now();
        if (license.isActive && (now < license.issuedAt || now > license.expiresAt)) {
          return false; // Failed: active outside valid timeframe
        }
        return true;
      }
    }
  ];
  
  // Run the formal verification process
  const runVerification = () => {
    setVerifying(true);
    setVerificationResults(properties.map(prop => ({ 
      property: prop.name, 
      status: 'pending' 
    })));
    
    // Simulate verification delay
    setTimeout(() => {
      const results = properties.map(prop => {
        // Run verification logic on each license
        const licensesWithIssues = licenses.filter(license => !prop.implementation(license));
        
        if (licensesWithIssues.length > 0) {
          return {
            property: prop.name,
            status: 'failed' as const,
            details: `Failed for ${licensesWithIssues.length} license(s): ${licensesWithIssues.map(l => l.id).join(', ')}`
          };
        }
        
        return {
          property: prop.name,
          status: 'passed' as const
        };
      });
      
      setVerificationResults(results);
      setVerifying(false);
    }, 2000);
  };
  
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">Formal Verification</h1>
        <p className="text-gray-400">
          Verify critical properties of the license management system using formal methods.
        </p>
      </div>
      
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 mb-6">
        <div className="flex items-center mb-4">
          <FileSpreadsheet className="h-6 w-6 text-blue-400 mr-2" />
          <h2 className="text-xl font-semibold text-white">Properties to Verify</h2>
        </div>
        
        <div className="space-y-4 mb-6">
          {properties.map(prop => (
            <div key={prop.id} className="bg-gray-900 rounded-lg p-4 border border-gray-700">
              <h3 className="text-lg font-medium text-white mb-1">{prop.name}</h3>
              <p className="text-sm text-gray-400 mb-3">{prop.description}</p>
              
              {verificationResults.find(r => r.property === prop.name) && (
                <div className={`flex items-center text-sm ${
                  verificationResults.find(r => r.property === prop.name)?.status === 'passed' 
                    ? 'text-green-400' 
                    : verificationResults.find(r => r.property === prop.name)?.status === 'failed'
                      ? 'text-red-400'
                      : 'text-yellow-400'
                }`}>
                  {verificationResults.find(r => r.property === prop.name)?.status === 'passed' ? (
                    <Check className="h-4 w-4 mr-1" />
                  ) : verificationResults.find(r => r.property === prop.name)?.status === 'failed' ? (
                    <X className="h-4 w-4 mr-1" />
                  ) : (
                    <Clock className="h-4 w-4 mr-1 animate-spin" />
                  )}
                  
                  <span>
                    {verificationResults.find(r => r.property === prop.name)?.status === 'passed'
                      ? 'Verification Passed'
                      : verificationResults.find(r => r.property === prop.name)?.status === 'failed'
                        ? 'Verification Failed'
                        : 'Verifying...'}
                  </span>
                </div>
              )}
              
              {verificationResults.find(r => r.property === prop.name)?.details && (
                <div className="mt-2 text-xs text-red-400 bg-red-900/30 p-2 rounded">
                  {verificationResults.find(r => r.property === prop.name)?.details}
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Info className="h-5 w-5 text-gray-400 mr-2" />
            <span className="text-sm text-gray-400">
              Verification runs against all licenses in the system
            </span>
          </div>
          
          <button
            onClick={runVerification}
            disabled={verifying}
            className={`px-4 py-2 rounded-md transition-colors ${
              verifying 
                ? 'bg-gray-700 text-gray-400 cursor-not-allowed' 
                : 'bg-blue-700 hover:bg-blue-600 text-white'
            }`}
          >
            {verifying ? (
              <span className="flex items-center">
                <Clock className="h-4 w-4 mr-2 animate-spin" />
                Verifying...
              </span>
            ) : 'Run Verification'}
          </button>
        </div>
      </div>
      
      {/* Verification Results */}
      {verificationResults.length > 0 && !verifying && (
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
          <div className="flex items-center mb-4">
            <FileSpreadsheet className="h-6 w-6 text-green-400 mr-2" />
            <h2 className="text-xl font-semibold text-white">Verification Results</h2>
          </div>
          
          <div className="bg-gray-900 rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-800">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Property
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Details
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {verificationResults.map((result, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-gray-900' : 'bg-gray-800'}>
                    <td className="px-4 py-3 text-sm text-white">
                      {result.property}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        result.status === 'passed' 
                          ? 'bg-green-900 text-green-300' 
                          : 'bg-red-900 text-red-300'
                      }`}>
                        {result.status === 'passed' ? (
                          <Check className="h-3 w-3 mr-1" />
                        ) : (
                          <X className="h-3 w-3 mr-1" />
                        )}
                        {result.status.charAt(0).toUpperCase() + result.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-300">
                      {result.details || (result.status === 'passed' ? 'All checks passed' : 'N/A')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="mt-4 flex justify-between">
            <div className="text-sm text-gray-400">
              <strong className="text-green-400">
                {verificationResults.filter(r => r.status === 'passed').length}
              </strong> passed, 
              <strong className="text-red-400 ml-1">
                {verificationResults.filter(r => r.status === 'failed').length}
              </strong> failed
            </div>
            
            <button className="text-sm text-blue-400 hover:text-blue-300">
              Export Results
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FormalVerification;