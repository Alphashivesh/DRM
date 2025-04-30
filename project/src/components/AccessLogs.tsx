import React from 'react';
import { useLicenses } from '../context/LicenseContext';
import { CheckCircle, XCircle } from 'lucide-react';

interface AccessLogsProps {
  licenseId: string;
}

const AccessLogs: React.FC<AccessLogsProps> = ({ licenseId }) => {
  const { licenses } = useLicenses();
  
  // Find the license
  const license = licenses.find(l => l.id === licenseId);
  
  if (!license) {
    return <div className="text-gray-400">License not found</div>;
  }
  
  // Sort logs by timestamp (newest first)
  const sortedLogs = [...license.accessLog].sort((a, b) => b.timestamp - a.timestamp);
  
  // Format date
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  
  return (
    <div>
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-white">{license.name}</h3>
        <p className="text-gray-400 text-sm">{license.contentName}</p>
      </div>
      
      {sortedLogs.length === 0 ? (
        <div className="text-gray-400 py-4">No access logs found for this license.</div>
      ) : (
        <div className="bg-gray-900 rounded-lg border border-gray-700 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-800">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Time
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Device ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  IP Address
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {sortedLogs.map((log, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-gray-900' : 'bg-gray-800'}>
                  <td className="px-4 py-3 text-sm text-gray-300">
                    {formatDate(log.timestamp)}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-300">
                    {log.deviceId}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-300">
                    {log.ip}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {log.granted ? (
                      <div className="flex items-center text-green-400">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        <span>Granted</span>
                      </div>
                    ) : (
                      <div className="flex items-center text-red-400">
                        <XCircle className="h-4 w-4 mr-1" />
                        <span>{log.reason || 'Denied'}</span>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AccessLogs;