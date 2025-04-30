import React, { useState } from 'react';
import { useLicenses } from '../context/LicenseContext';
import LicenseCard from './LicenseCard';
import { CheckCircle as CircleCheck, History, PlusCircle, ShieldAlert } from 'lucide-react';
import CreateLicenseForm from './CreateLicenseForm';
import AccessLogs from './AccessLogs';

const Dashboard: React.FC = () => {
  const { licenses, currentUser } = useLicenses();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showAccessLogs, setShowAccessLogs] = useState(false);
  const [selectedLicenseId, setSelectedLicenseId] = useState<string | null>(null);
  
  // Calculate license statistics
  const activeLicenses = licenses.filter(license => license.isActive && license.expiresAt > Date.now());
  const expiredLicenses = licenses.filter(license => license.expiresAt < Date.now());
  const totalAccesses = licenses.reduce((acc, license) => acc + license.accessLog.length, 0);
  const deniedAccesses = licenses.reduce(
    (acc, license) => acc + license.accessLog.filter(log => !log.granted).length, 
    0
  );
  
  // Handle viewing access logs for a specific license
  const handleViewLogs = (licenseId: string) => {
    setSelectedLicenseId(licenseId);
    setShowAccessLogs(true);
  };
  
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">
          {currentUser?.role === 'provider' ? 'Content Provider Dashboard' : 'Your Content Licenses'}
        </h1>
        <p className="text-gray-400">
          {currentUser?.role === 'provider' 
            ? 'Manage and monitor your content licenses and usage.' 
            : 'View and manage your content access licenses.'}
        </p>
      </div>
      
      {/* Stats section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center">
            <div className="bg-blue-900/50 p-3 rounded-full mr-4">
              <CircleCheck className="h-6 w-6 text-blue-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Active Licenses</p>
              <p className="text-2xl font-semibold text-white">{activeLicenses.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center">
            <div className="bg-red-900/50 p-3 rounded-full mr-4">
              <History className="h-6 w-6 text-red-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Expired Licenses</p>
              <p className="text-2xl font-semibold text-white">{expiredLicenses.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center">
            <div className="bg-green-900/50 p-3 rounded-full mr-4">
              <History className="h-6 w-6 text-green-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Total Accesses</p>
              <p className="text-2xl font-semibold text-white">{totalAccesses}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center">
            <div className="bg-yellow-900/50 p-3 rounded-full mr-4">
              <ShieldAlert className="h-6 w-6 text-yellow-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Access Denials</p>
              <p className="text-2xl font-semibold text-white">{deniedAccesses}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Action buttons */}
      <div className="flex mb-6 space-x-4">
        <button 
          onClick={() => setShowCreateForm(true)}
          className="bg-emerald-700 hover:bg-emerald-600 text-white px-4 py-2 rounded-md flex items-center transition-colors"
        >
          <PlusCircle className="h-5 w-5 mr-2" />
          Create New License
        </button>
      </div>
      
      {/* License list */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {licenses.map(license => (
          <div key={license.id} className="relative">
            <LicenseCard license={license} />
            <button 
              onClick={() => handleViewLogs(license.id)}
              className="absolute top-2 right-2 bg-gray-700 hover:bg-gray-600 p-1 rounded-full transition-colors"
              title="View access logs"
            >
              <History className="h-4 w-4 text-gray-300" />
            </button>
          </div>
        ))}
      </div>
      
      {/* Create license modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg w-full max-w-md p-6 border border-gray-700">
            <h2 className="text-xl font-bold text-white mb-4">Create New License</h2>
            <CreateLicenseForm onClose={() => setShowCreateForm(false)} />
          </div>
        </div>
      )}
      
      {/* Access logs modal */}
      {showAccessLogs && selectedLicenseId && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg w-full max-w-lg p-6 border border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">Access Logs</h2>
              <button 
                onClick={() => setShowAccessLogs(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <AccessLogs licenseId={selectedLicenseId} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;