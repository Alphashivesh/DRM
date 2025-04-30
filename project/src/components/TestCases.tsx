import React, { useState } from 'react';
import { useLicenses } from '../context/LicenseContext';
import { BeakerIcon, Check, Clock, FileCog, X } from 'lucide-react';
import { verifyLicense } from '../utils/cryptoUtils';

// This component demonstrates a test suite for the license management module
const TestCases: React.FC = () => {
  const { licenses, addLicense, activateLicense, deactivateLicense } = useLicenses();
  const [runningTests, setRunningTests] = useState(false);
  const [testResults, setTestResults] = useState<Array<{
    id: string;
    name: string;
    status: 'passed' | 'failed' | 'pending';
    input: string;
    expected: string;
    actual?: string;
  }>>([]);
  
  // Define test cases
  const testCases = [
    {
      id: 'test1',
      name: 'License Validation - Valid Active License',
      implementation: () => {
        // Find an active, non-expired license
        const license = licenses.find(l => l.isActive && l.expiresAt > Date.now());
        
        if (!license) {
          return {
            status: 'failed',
            input: 'Active, non-expired license',
            expected: 'Access granted',
            actual: 'No valid license found for testing'
          };
        }
        
        const deviceId = 'test-device-001';
        const result = verifyLicense(license, deviceId);
        
        return {
          status: result.valid ? 'passed' : 'failed',
          input: `License ID: ${license.id}`,
          expected: 'Access granted (valid=true)',
          actual: `${result.valid ? 'Access granted' : `Access denied: ${result.reason}`}`
        };
      }
    },
    {
      id: 'test2',
      name: 'License Validation - Expired License',
      implementation: () => {
        // Find an expired license or create one
        let license = licenses.find(l => l.expiresAt < Date.now());
        
        if (!license) {
          // Create a test expired license
          const testLicense = {
            name: 'Test Expired License',
            contentId: 'test-content-001',
            contentType: 'video' as const,
            contentName: 'Test Content',
            issuedTo: 'test@example.com',
            expiresAt: Date.now() - 86400000, // Expired 1 day ago
            isActive: true
          };
          
          addLicense(testLicense);
          
          // Get the newly created license
          license = licenses[licenses.length - 1];
        }
        
        const deviceId = 'test-device-001';
        const result = verifyLicense(license, deviceId);
        
        return {
          status: !result.valid && result.reason?.includes('expired') ? 'passed' : 'failed',
          input: `Expired license ID: ${license.id}`,
          expected: 'Access denied with expiration message',
          actual: `${!result.valid && result.reason?.includes('expired') ? 
            `Access denied: ${result.reason}` : 
            'Unexpected result: ' + (result.valid ? 'Access granted' : `Access denied: ${result.reason}`)}`
        };
      }
    },
    {
      id: 'test3',
      name: 'License Activation/Deactivation',
      implementation: () => {
        // Create a test license for activation testing
        const testLicense = {
          name: 'Test Activation License',
          contentId: 'test-content-002',
          contentType: 'document' as const,
          contentName: 'Test Document',
          issuedTo: 'test@example.com',
          expiresAt: Date.now() + 86400000, // Expires in 1 day
          isActive: false // Initially inactive
        };
        
        addLicense(testLicense);
        
        // Get the newly created license
        const license = licenses[licenses.length - 1];
        
        // Test activation
        activateLicense(license.id);
        const updatedLicense = licenses.find(l => l.id === license.id);
        
        if (!updatedLicense || !updatedLicense.isActive) {
          return {
            status: 'failed',
            input: `License ID: ${license.id}, action: activate`,
            expected: 'License activated (isActive=true)',
            actual: updatedLicense ? `License status unchanged (isActive=${updatedLicense.isActive})` : 'License not found'
          };
        }
        
        // Test deactivation
        deactivateLicense(license.id);
        const deactivatedLicense = licenses.find(l => l.id === license.id);
        
        return {
          status: !deactivatedLicense?.isActive ? 'passed' : 'failed',
          input: `License ID: ${license.id}, actions: activate then deactivate`,
          expected: 'License deactivated (isActive=false)',
          actual: deactivatedLicense ? 
            `License ${!deactivatedLicense.isActive ? 'successfully deactivated' : 'remained active'}` : 
            'License not found'
        };
      }
    },
    {
      id: 'test4',
      name: 'Usage Limit Enforcement',
      implementation: () => {
        // Create a test license with usage limits
        const testLicense = {
          name: 'Test Usage Limit License',
          contentId: 'test-content-003',
          contentType: 'video' as const,
          contentName: 'Test Video',
          issuedTo: 'test@example.com',
          expiresAt: Date.now() + 86400000, // Expires in 1 day
          isActive: true,
          usageLimit: 3
        };
        
        addLicense(testLicense);
        
        // Get the newly created license
        const license = licenses[licenses.length - 1];
        
        // Simulate access attempts
        let lastResult;
        for (let i = 0; i < 4; i++) { // Try one more than the limit
          const deviceId = 'test-device-001';
          const ip = '127.0.0.1';
          lastResult = license.usageLimit && license.currentUsage >= license.usageLimit;
        }
        
        // Final validation
        const result = verifyLicense({...license, currentUsage: license.usageLimit || 0}, 'test-device-001');
        
        return {
          status: !result.valid && result.reason?.includes('limit') ? 'passed' : 'failed',
          input: `License with usage limit of ${license.usageLimit}, used ${license.usageLimit} times`,
          expected: 'Access denied when limit reached',
          actual: `${!result.valid ? `Access denied: ${result.reason}` : 'Access still granted'}`
        };
      }
    },
    {
      id: 'test5',
      name: 'License Key Generation',
      implementation: () => {
        // Test creating multiple licenses and ensure unique keys
        const testLicense1 = {
          name: 'Test License Key 1',
          contentId: 'test-content-key-1',
          contentType: 'audio' as const,
          contentName: 'Test Audio 1',
          issuedTo: 'test@example.com',
          expiresAt: Date.now() + 86400000,
          isActive: true
        };
        
        const testLicense2 = {
          name: 'Test License Key 2',
          contentId: 'test-content-key-2',
          contentType: 'audio' as const,
          contentName: 'Test Audio 2',
          issuedTo: 'test@example.com',
          expiresAt: Date.now() + 86400000,
          isActive: true
        };
        
        // Add both licenses
        addLicense(testLicense1);
        addLicense(testLicense2);
        
        // Get the newly created licenses
        const license1 = licenses[licenses.length - 2];
        const license2 = licenses[licenses.length - 1];
        
        // Compare access keys
        const keysAreUnique = license1.accessKey !== license2.accessKey;
        const keysAreNotEmpty = license1.accessKey.length > 0 && license2.accessKey.length > 0;
        
        return {
          status: keysAreUnique && keysAreNotEmpty ? 'passed' : 'failed',
          input: 'Two license creation requests',
          expected: 'Unique, non-empty access keys for each license',
          actual: keysAreUnique && keysAreNotEmpty ? 
            'Each license received a unique access key' : 
            `Keys ${!keysAreUnique ? 'are not unique' : 'contain empty values'}`
        };
      }
    }
  ];
  
  // Run all test cases
  const runTests = () => {
    setRunningTests(true);
    setTestResults(testCases.map(test => ({
      id: test.id,
      name: test.name,
      status: 'pending',
      input: '',
      expected: ''
    })));
    
    // Run tests with a delay to simulate testing process
    setTimeout(() => {
      const results = testCases.map(test => ({
        id: test.id,
        name: test.name,
        ...test.implementation()
      }));
      
      setTestResults(results);
      setRunningTests(false);
    }, 2000);
  };
  
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">Test Suite</h1>
        <p className="text-gray-400">
          Run automated tests against the license management module to verify functionality.
        </p>
      </div>
      
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <BeakerIcon className="h-6 w-6 text-purple-400 mr-2" />
            <h2 className="text-xl font-semibold text-white">Test Cases</h2>
          </div>
          
          <button
            onClick={runTests}
            disabled={runningTests}
            className={`px-4 py-2 rounded-md transition-colors ${
              runningTests 
                ? 'bg-gray-700 text-gray-400 cursor-not-allowed' 
                : 'bg-purple-700 hover:bg-purple-600 text-white'
            }`}
          >
            {runningTests ? (
              <span className="flex items-center">
                <Clock className="h-4 w-4 mr-2 animate-spin" />
                Running Tests...
              </span>
            ) : 'Run All Tests'}
          </button>
        </div>
        
        <div className="space-y-4">
          {testCases.map((test, index) => (
            <div key={test.id} className="bg-gray-900 rounded-lg p-4 border border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-medium text-white">{test.name}</h3>
                
                {testResults.find(r => r.id === test.id) && (
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    testResults.find(r => r.id === test.id)?.status === 'passed' 
                      ? 'bg-green-900 text-green-300' 
                      : testResults.find(r => r.id === test.id)?.status === 'failed'
                        ? 'bg-red-900 text-red-300'
                        : 'bg-yellow-900 text-yellow-300'
                  }`}>
                    {testResults.find(r => r.id === test.id)?.status === 'passed' ? (
                      <Check className="h-3 w-3 mr-1" />
                    ) : testResults.find(r => r.id === test.id)?.status === 'failed' ? (
                      <X className="h-3 w-3 mr-1" />
                    ) : (
                      <Clock className="h-3 w-3 mr-1 animate-spin" />
                    )}
                    
                    <span>
                      {testResults.find(r => r.id === test.id)?.status.charAt(0).toUpperCase() + 
                       testResults.find(r => r.id === test.id)?.status.slice(1)}
                    </span>
                  </span>
                )}
              </div>
              
              {testResults.find(r => r.id === test.id) && testResults.find(r => r.id === test.id)?.status !== 'pending' && (
                <div className="mt-3 text-sm">
                  <div className="mb-2">
                    <span className="text-gray-400">Input: </span>
                    <span className="text-white">{testResults.find(r => r.id === test.id)?.input}</span>
                  </div>
                  <div className="mb-2">
                    <span className="text-gray-400">Expected: </span>
                    <span className="text-white">{testResults.find(r => r.id === test.id)?.expected}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Actual: </span>
                    <span className={`${
                      testResults.find(r => r.id === test.id)?.status === 'passed'
                        ? 'text-green-400'
                        : 'text-red-400'
                    }`}>
                      {testResults.find(r => r.id === test.id)?.actual}
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      
      {/* Test Results Summary */}
      {testResults.length > 0 && !runningTests && (
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
          <div className="flex items-center mb-4">
            <FileCog className="h-6 w-6 text-blue-400 mr-2" />
            <h2 className="text-xl font-semibold text-white">Test Results</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-900 p-4 rounded-lg border border-gray-700 flex items-center">
              <div className="h-10 w-10 rounded-full bg-gray-800 flex items-center justify-center mr-3">
                <span className="text-white font-bold">{testResults.length}</span>
              </div>
              <div>
                <p className="text-sm text-gray-400">Total Tests</p>
                <p className="text-lg font-semibold text-white">
                  {testResults.length} test cases
                </p>
              </div>
            </div>
            
            <div className="bg-gray-900 p-4 rounded-lg border border-gray-700 flex items-center">
              <div className="h-10 w-10 rounded-full bg-green-900/50 flex items-center justify-center mr-3">
                <span className="text-green-400 font-bold">
                  {testResults.filter(r => r.status === 'passed').length}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-400">Passed</p>
                <p className="text-lg font-semibold text-green-400">
                  {testResults.filter(r => r.status === 'passed').length} tests passed
                </p>
              </div>
            </div>
            
            <div className="bg-gray-900 p-4 rounded-lg border border-gray-700 flex items-center">
              <div className="h-10 w-10 rounded-full bg-red-900/50 flex items-center justify-center mr-3">
                <span className="text-red-400 font-bold">
                  {testResults.filter(r => r.status === 'failed').length}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-400">Failed</p>
                <p className="text-lg font-semibold text-red-400">
                  {testResults.filter(r => r.status === 'failed').length} tests failed
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
            <h3 className="text-lg font-medium text-white mb-2">Test Coverage</h3>
            <p className="text-sm text-gray-400 mb-3">
              The test suite covers key functionality of the license management module.
            </p>
            
            <ul className="space-y-2 text-sm">
              <li className="flex items-start">
                <Check className="h-4 w-4 text-green-400 mr-2 mt-0.5" />
                <span className="text-gray-300">
                  License validation and verification logic
                </span>
              </li>
              <li className="flex items-start">
                <Check className="h-4 w-4 text-green-400 mr-2 mt-0.5" />
                <span className="text-gray-300">
                  License activation and deactivation
                </span>
              </li>
              <li className="flex items-start">
                <Check className="h-4 w-4 text-green-400 mr-2 mt-0.5" />
                <span className="text-gray-300">
                  Usage limit enforcement
                </span>
              </li>
              <li className="flex items-start">
                <Check className="h-4 w-4 text-green-400 mr-2 mt-0.5" />
                <span className="text-gray-300">
                  License key generation and uniqueness
                </span>
              </li>
              <li className="flex items-start">
                <Check className="h-4 w-4 text-green-400 mr-2 mt-0.5" />
                <span className="text-gray-300">
                  Expiration date handling
                </span>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestCases;