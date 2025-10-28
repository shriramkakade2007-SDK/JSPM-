
import React, { useState, useMemo, useEffect } from 'react';
import { students } from '../constants';
import type { Student, AttendanceHistory } from '../types';
import { SearchIcon, CheckCircleIcon, XCircleIcon } from './Icons';

const ATTENDANCE_KEY = 'jspm-attendance-history';

const StudentView: React.FC = () => {
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [history, setHistory] = useState<AttendanceHistory>({});

  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem(ATTENDANCE_KEY);
      setHistory(storedHistory ? JSON.parse(storedHistory) : {});
    } catch (error) {
      console.error("Failed to load attendance from localStorage", error);
    }
  }, []);

  const filteredStudents = useMemo(() => {
    if (!searchTerm) return [];
    return students.filter(student =>
      student.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.rollNo.toLowerCase().includes(searchTerm.toLowerCase())
    ).slice(0, 5); // Limit results for performance
  }, [searchTerm]);

  const studentAttendance = useMemo(() => {
    if (!selectedStudent) return [];
    
    return Object.entries(history)
      .map(([date, dailyAttendance]) => ({
        date,
        status: dailyAttendance[selectedStudent.rollNo] || 'Unmarked'
      }))
      .filter(record => record.status !== 'Unmarked')
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [selectedStudent, history]);

  const stats = useMemo(() => {
    const total = studentAttendance.length;
    const present = studentAttendance.filter(r => r.status === 'Present').length;
    const absent = total - present;
    const percentage = total > 0 ? ((present / total) * 100).toFixed(2) : '0.00';
    return { total, present, absent, percentage };
  }, [studentAttendance]);

  if (!selectedStudent) {
    return (
      <div className="max-w-xl mx-auto">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
          <h2 className="text-2xl font-bold text-center mb-4">Find Your Attendance</h2>
          <div className="relative">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"/>
            <input
              type="text"
              placeholder="Enter your name or roll number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-lg"
            />
          </div>
          {searchTerm && (
            <ul className="mt-2 bg-white dark:bg-gray-700 border dark:border-gray-600 rounded-lg shadow-lg">
              {filteredStudents.length > 0 ? filteredStudents.map(student => (
                <li key={student.rollNo} onClick={() => setSelectedStudent(student)} className="p-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 border-b dark:border-gray-600 last:border-b-0">
                  <p className="font-semibold">{student.studentName}</p>
                  <p className="text-sm text-gray-500">{student.rollNo}</p>
                </li>
              )) : <li className="p-3 text-center text-gray-500">No students found.</li>}
            </ul>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
       <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
        <div className="flex justify-between items-start">
            <div>
                <h2 className="text-2xl font-bold">{selectedStudent.studentName}</h2>
                <p className="text-gray-500">{selectedStudent.rollNo} - {selectedStudent.specialisation}</p>
            </div>
            <button onClick={() => setSelectedStudent(null)} className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">Change Student</button>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 text-center">
            <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <p className="text-2xl font-bold">{stats.percentage}%</p>
                <p className="text-sm text-gray-500">Attendance</p>
            </div>
             <div className="p-4 bg-green-100 dark:bg-green-900/50 rounded-lg">
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.present}</p>
                <p className="text-sm text-gray-500">Present Days</p>
            </div>
             <div className="p-4 bg-red-100 dark:bg-red-900/50 rounded-lg">
                <p className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.absent}</p>
                <p className="text-sm text-gray-500">Absent Days</p>
            </div>
             <div className="p-4 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.total}</p>
                <p className="text-sm text-gray-500">Total Days</p>
            </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md">
        <h3 className="text-lg font-semibold px-2 mb-2">Attendance History</h3>
        <div className="max-h-96 overflow-y-auto">
            <table className="w-full text-left">
                <thead className="sticky top-0 bg-gray-50 dark:bg-gray-700">
                    <tr>
                        <th className="p-3 text-sm font-semibold tracking-wide">Date</th>
                        <th className="p-3 text-sm font-semibold tracking-wide">Status</th>
                    </tr>
                </thead>
                <tbody>
                {studentAttendance.map(({ date, status }) => (
                    <tr key={date} className="border-b dark:border-gray-700">
                        <td className="p-3 text-gray-700 dark:text-gray-300">{new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</td>
                        <td className="p-3">
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                status === 'Present' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                            }`}>
                                {status}
                            </span>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
             {studentAttendance.length === 0 && <p className="text-center p-8 text-gray-500">No attendance records found.</p>}
        </div>
      </div>
    </div>
  );
};

export default StudentView;
