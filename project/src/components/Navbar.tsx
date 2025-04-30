import React from 'react';
import { Shield as ShieldLock, Settings, User } from 'lucide-react';
import { useLicenses } from '../context/LicenseContext';

interface NavbarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentView, setCurrentView }) => {
  const { currentUser, switchUserRole } = useLicenses();

  return (
    <nav className="bg-gray-900 text-white py-4 px-6 flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <ShieldLock className="h-6 w-6 text-emerald-400" />
        <span className="text-xl font-bold">SecureDRM</span>
      </div>
      
      <div className="flex items-center space-x-6">
        <button 
          onClick={() => setCurrentView('dashboard')}
          className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${
            currentView === 'dashboard' ? 'bg-gray-800 text-emerald-400' : 'hover:bg-gray-800'
          }`}
        >
          <ShieldLock className="h-5 w-5" />
          <span>Dashboard</span>
        </button>
        
        <button 
          onClick={() => setCurrentView('settings')}
          className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${
            currentView === 'settings' ? 'bg-gray-800 text-emerald-400' : 'hover:bg-gray-800'
          }`}
        >
          <Settings className="h-5 w-5" />
          <span>Settings</span>
        </button>
        
        <div className="flex items-center space-x-2 ml-4 pl-4 border-l border-gray-700">
          <User className="h-5 w-5 text-gray-400" />
          <div className="flex flex-col">
            <span className="text-sm">{currentUser?.name}</span>
            <button 
              onClick={switchUserRole}
              className="text-xs text-emerald-400 hover:text-emerald-300 text-left"
            >
              Switch to {currentUser?.role === 'provider' ? 'Subscriber' : 'Provider'} View
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;