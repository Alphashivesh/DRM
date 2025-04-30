import React, { useState } from 'react';
import { AlertTriangle, Key, Lock, Shield, User } from 'lucide-react';
import { generateKey } from '../utils/cryptoUtils';

const Settings: React.FC = () => {
  const [encryptionKey, setEncryptionKey] = useState('');
  const [showResetWarning, setShowResetWarning] = useState(false);
  
  // Generate a new encryption key
  const handleGenerateKey = () => {
    const newKey = generateKey(32);
    setEncryptionKey(newKey);
  };
  
  // Reset warning modal
  const handleResetClick = () => {
    setShowResetWarning(true);
  };
  
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">System Settings</h1>
        <p className="text-gray-400">
          Configure security settings and system preferences for the DRM system.
        </p>
      </div>
      
      {/* Security Settings */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 mb-6">
        <div className="flex items-center mb-4">
          <Shield className="h-6 w-6 text-emerald-400 mr-2" />
          <h2 className="text-xl font-semibold text-white">Security Settings</h2>
        </div>
        
        <div className="space-y-6">
          {/* Encryption Key Management */}
          <div className="border-b border-gray-700 pb-6">
            <h3 className="text-lg font-medium text-white mb-3 flex items-center">
              <Key className="h-5 w-5 text-blue-400 mr-2" />
              Encryption Key Management
            </h3>
            
            <p className="text-gray-400 mb-4 text-sm">
              Generate or update the master encryption key used for securing license data. 
              Changing this key will not affect existing licenses but will be used for newly created ones.
            </p>
            
            <div className="flex items-center space-x-3 mb-4">
              <input
                type="text"
                value={encryptionKey}
                readOnly
                placeholder="No key generated"
                className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              
              <button
                onClick={handleGenerateKey}
                className="px-4 py-2 bg-blue-700 hover:bg-blue-600 text-white rounded-md transition-colors"
              >
                Generate New Key
              </button>
            </div>
            
            <div className="flex items-center">
              <span className="text-xs text-gray-400">
                Last key rotation: 30 days ago
              </span>
              <button className="ml-2 text-xs text-blue-400 hover:text-blue-300 underline">
                View rotation history
              </button>
            </div>
          </div>
          
          {/* Authentication Settings */}
          <div className="border-b border-gray-700 pb-6">
            <h3 className="text-lg font-medium text-white mb-3 flex items-center">
              <User className="h-5 w-5 text-purple-400 mr-2" />
              Authentication Settings
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white">Two-Factor Authentication</p>
                  <p className="text-xs text-gray-400">Require 2FA for admin access</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" value="" className="sr-only peer" checked/>
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white">Session Timeout</p>
                  <p className="text-xs text-gray-400">Auto-logout after inactivity</p>
                </div>
                <select className="bg-gray-700 border border-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 px-3 py-1.5">
                  <option value="15">15 minutes</option>
                  <option value="30">30 minutes</option>
                  <option value="60">1 hour</option>
                </select>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white">IP Restriction</p>
                  <p className="text-xs text-gray-400">Limit access to specific IP ranges</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" value="" className="sr-only peer"/>
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>
          
          {/* Content Protection */}
          <div>
            <h3 className="text-lg font-medium text-white mb-3 flex items-center">
              <Lock className="h-5 w-5 text-yellow-400 mr-2" />
              Content Protection
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white">Watermarking</p>
                  <p className="text-xs text-gray-400">Add user identification to content</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" value="" className="sr-only peer" checked/>
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white">Content Encryption Level</p>
                  <p className="text-xs text-gray-400">Strength of content encryption</p>
                </div>
                <select className="bg-gray-700 border border-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 px-3 py-1.5">
                  <option value="aes-128">AES-128</option>
                  <option value="aes-256" selected>AES-256</option>
                  <option value="aes-512">AES-512</option>
                </select>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white">Offline Access</p>
                  <p className="text-xs text-gray-400">Allow content use without internet</p>
                </div>
                <select className="bg-gray-700 border border-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 px-3 py-1.5">
                  <option value="0">Not allowed</option>
                  <option value="1">1 day</option>
                  <option value="7" selected>7 days</option>
                  <option value="30">30 days</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* System Maintenance */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
        <div className="flex items-center mb-4">
          <AlertTriangle className="h-6 w-6 text-yellow-400 mr-2" />
          <h2 className="text-xl font-semibold text-white">System Maintenance</h2>
        </div>
        
        <p className="text-gray-400 mb-4 text-sm">
          System maintenance options should be used with caution. 
          These actions can affect the operation of the DRM system.
        </p>
        
        <div className="space-y-4">
          <button
            onClick={handleResetClick}
            className="w-full px-4 py-2 bg-red-800 hover:bg-red-700 text-white rounded-md transition-colors flex items-center justify-center"
          >
            <AlertTriangle className="h-5 w-5 mr-2" />
            Reset System
          </button>
          
          <button
            className="w-full px-4 py-2 bg-blue-800 hover:bg-blue-700 text-white rounded-md transition-colors flex items-center justify-center"
          >
            Export System Logs
          </button>
        </div>
      </div>
      
      {/* Reset Warning Modal */}
      {showResetWarning && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg w-full max-w-md p-6 border border-gray-700">
            <div className="flex items-center mb-4 text-red-500">
              <AlertTriangle className="h-6 w-6 mr-2" />
              <h2 className="text-xl font-bold">Warning: System Reset</h2>
            </div>
            
            <p className="text-gray-300 mb-4">
              This action will reset the entire DRM system, including all licenses, keys, and user data. 
              This action cannot be undone.
            </p>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowResetWarning(false)}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-700 hover:bg-red-600 text-white rounded-md transition-colors"
              >
                Confirm Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;