import React, { useState } from 'react';
import { LicenseProvider } from './context/LicenseContext';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import Settings from './components/Settings';
import FormalVerification from './components/FormalVerification';
import TestCases from './components/TestCases';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');

  // Render the appropriate view based on currentView state
  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'settings':
        return <Settings />;
      case 'verification':
        return <FormalVerification />;
      case 'tests':
        return <TestCases />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <LicenseProvider>
      <div className="min-h-screen bg-gray-900 text-white">
        <Navbar currentView={currentView} setCurrentView={setCurrentView} />
        
        <main className="pt-4">
          {renderView()}
        </main>
        
        {/* Footer navigation for additional views */}
        <footer className="bg-gray-900 border-t border-gray-800 py-4 px-6">
          <div className="container mx-auto flex flex-wrap justify-center space-x-2 md:space-x-6">
            <button 
              onClick={() => setCurrentView('dashboard')}
              className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                currentView === 'dashboard' ? 'bg-gray-800 text-emerald-400' : 'text-gray-400 hover:text-white'
              }`}
            >
              Dashboard
            </button>
            
            <button 
              onClick={() => setCurrentView('verification')}
              className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                currentView === 'verification' ? 'bg-gray-800 text-emerald-400' : 'text-gray-400 hover:text-white'
              }`}
            >
              Formal Verification
            </button>
            
            <button 
              onClick={() => setCurrentView('tests')}
              className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                currentView === 'tests' ? 'bg-gray-800 text-emerald-400' : 'text-gray-400 hover:text-white'
              }`}
            >
              Test Suite
            </button>
            
            <button 
              onClick={() => setCurrentView('settings')}
              className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                currentView === 'settings' ? 'bg-gray-800 text-emerald-400' : 'text-gray-400 hover:text-white'
              }`}
            >
              Settings
            </button>
          </div>
        </footer>
      </div>
    </LicenseProvider>
  );
}

export default App;