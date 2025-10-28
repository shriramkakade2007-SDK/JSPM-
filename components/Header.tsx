import React from 'react';
import type { UserRole } from '../types';
import { LogoutIcon } from './Icons';
import { jspmLogoBase64 } from '../assets/jspm-logo';

interface HeaderProps {
  userRole: UserRole | null;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ userRole, onLogout }) => {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <img src={jspmLogoBase64} alt="JSPM Logo" className="h-10 w-10" />
          <div>
            <h1 className="text-lg md:text-xl font-bold text-gray-800 dark:text-white">JSPM Attendance Portal</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">Faculty of Science and Technology</p>
          </div>
        </div>
        {userRole && (
          <button
            onClick={onLogout}
            className="flex items-center space-x-2 px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors"
          >
            <LogoutIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;