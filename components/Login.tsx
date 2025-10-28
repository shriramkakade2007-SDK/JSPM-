import React, { useState } from 'react';
import type { UserRole } from '../types';
import { LoginUserIcon, LockIcon, EyeIcon, EyeSlashIcon } from './Icons';
import { jspmLogoBase64 } from '../assets/jspm-logo';

interface LoginProps {
  onLogin: (role: UserRole) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleLoginAttempt = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const usernameLower = username.toLowerCase();

    if (usernameLower === 'teacher' && password === 'password') {
      onLogin('teacher');
    } else if (usernameLower === 'student' && password === 'password') {
      onLogin('student');
    } else {
      setError("Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-sky-100 dark:bg-gray-900 p-4 font-sans">
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-6">
          <img src={jspmLogoBase64} alt="JSPM University Logo" className="h-24 w-24" />
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg">
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 rounded-full bg-sky-100 dark:bg-sky-900 flex items-center justify-center border-4 border-white dark:border-gray-700">
              <LoginUserIcon className="w-12 h-12 text-sky-600 dark:text-sky-400" />
            </div>
          </div>
          
          <form onSubmit={handleLoginAttempt} className="space-y-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LoginUserIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="Username"
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LockIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-md placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="Password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            </div>

            {error && (
              <p className="text-sm text-red-500 text-center">{error}</p>
            )}

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-sky-600 focus:ring-sky-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-gray-900 dark:text-gray-300">
                  Remember me
                </label>
              </div>
              <a href="#" className="font-medium text-sky-600 hover:text-sky-500 dark:text-sky-400 dark:hover:text-sky-300">
                Forgot password?
              </a>
            </div>

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-semibold rounded-md text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-colors"
              >
                LOGIN
              </button>
            </div>
            <p className="text-xs text-center text-gray-500 dark:text-gray-400">
              Use 'teacher' or 'student' with password 'password'.
            </p>
          </form>
        </div>
        <footer className="text-center p-4 text-xs text-gray-500">
          <p>JSPM University, Pune. Academic Year 2025-26.</p>
        </footer>
      </div>
    </div>
  );
};

export default Login;