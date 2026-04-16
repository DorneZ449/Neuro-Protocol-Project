import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import ProfileDropdown from './ProfileDropdown';
import CurrencySelector from './CurrencySelector';

const Navbar: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-4 sm:gap-8">
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => handleNavigation('/')}
            >
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="flex flex-col">
                <h1 className="text-lg sm:text-xl font-bold text-gray-800 leading-tight">КлиентХаб</h1>
                <span className="text-xs text-gray-500 leading-tight">ClientHub</span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              <button
                onClick={() => navigate('/')}
                className={`px-4 py-3 rounded-lg font-medium transition-colors ${
                  isActive('/')
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                Дашборд
              </button>
              <button
                onClick={() => navigate('/clients')}
                className={`px-4 py-3 rounded-lg font-medium transition-colors ${
                  isActive('/clients') || location.pathname.startsWith('/clients/')
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                Клиенты
              </button>
              <button
                onClick={() => navigate('/calendar')}
                className={`px-4 py-3 rounded-lg font-medium transition-colors ${
                  isActive('/calendar')
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                Календарь
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            {user && (
              <>
                <CurrencySelector />
                <ProfileDropdown />
              </>
            )}
            
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Меню"
              aria-expanded={mobileMenuOpen}
            >
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-2">
            <nav className="flex flex-col space-y-1">
              <button
                onClick={() => handleNavigation('/')}
                className={`px-4 py-3 rounded-lg font-medium text-left transition-colors ${
                  isActive('/')
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                Дашборд
              </button>
              <button
                onClick={() => handleNavigation('/clients')}
                className={`px-4 py-3 rounded-lg font-medium text-left transition-colors ${
                  isActive('/clients') || location.pathname.startsWith('/clients/')
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                Клиенты
              </button>
              <button
                onClick={() => handleNavigation('/calendar')}
                className={`px-4 py-3 rounded-lg font-medium text-left transition-colors ${
                  isActive('/calendar')
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                Календарь
              </button>
            </nav>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
