import React, { useState, useCallback } from 'react';
import type { UserRole } from './types';
import Login from './components/Login';
import TeacherDashboard from './components/TeacherDashboard';
import StudentView from './components/StudentView';
import Header from './components/Header';

const App: React.FC = () => {
  const [userRole, setUserRole] = useState<UserRole | null>(null);

  const handleLogin = useCallback((role: UserRole) => {
    setUserRole(role);
  }, []);

  const handleLogout = useCallback(() => {
    setUserRole(null);
  }, []);

  if (!userRole) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-gray-100 font-sans">
      <Header userRole={userRole} onLogout={handleLogout} />
      <main className="container mx-auto p-4 md:p-6">
        {userRole === 'teacher' && <TeacherDashboard />}
        {userRole === 'student' && <StudentView />}
      </main>
      <footer className="text-center p-4 text-xs text-gray-500">
        <p>JSPM University, Pune. Academic Year 2025-26.</p>
      </footer>
    </div>
  );
};

export default App;
