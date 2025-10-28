
import React, { useState, useMemo, useEffect } from 'react';
import { students } from '../constants';
import type { Student, DailyAttendance, AttendanceHistory, AttendanceStatus } from '../types';
import StudentCard from './StudentCard';
import { SearchIcon, DownloadIcon, CheckCircleIcon, XCircleIcon, UserIcon } from './Icons';
import { motion, AnimatePresence } from 'framer-motion';

const ATTENDANCE_KEY = 'jspm-attendance-history';

const getTodayDateString = () => {
  return new Date().toISOString().split('T')[0];
};

const TeacherDashboard: React.FC = () => {
  const [attendance, setAttendance] = useState<DailyAttendance>({});
  const [history, setHistory] = useState<AttendanceHistory>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [showAllStudents, setShowAllStudents] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem(ATTENDANCE_KEY);
      const parsedHistory: AttendanceHistory = storedHistory ? JSON.parse(storedHistory) : {};
      setHistory(parsedHistory);

      const today = getTodayDateString();
      const todayAttendance = parsedHistory[today] || {};
      
      const initialAttendance: DailyAttendance = {};
      students.forEach(student => {
        initialAttendance[student.rollNo] = todayAttendance[student.rollNo] || 'Unmarked';
      });
      setAttendance(initialAttendance);
    } catch (error) {
      console.error("Failed to load attendance from localStorage", error);
    }
  }, []);
  
  const unmarkedStudents = useMemo(() => {
    return students.filter(s => attendance[s.rollNo] === 'Unmarked').reverse();
  }, [attendance]);

  useEffect(() => {
    setCurrentIndex(unmarkedStudents.length - 1);
  }, [unmarkedStudents.length]);

  useEffect(() => {
    if (Object.keys(attendance).length > 0) {
      const today = getTodayDateString();
      const newHistory = { ...history, [today]: attendance };
      localStorage.setItem(ATTENDANCE_KEY, JSON.stringify(newHistory));
      setHistory(newHistory);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attendance]);

  const handleMarkAttendance = (rollNo: string, status: 'Present' | 'Absent') => {
    setAttendance(prev => ({ ...prev, [rollNo]: status }));
  };

  const filteredStudents = useMemo(() => {
    return students.filter(student =>
      student.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.rollNo.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const downloadCSV = () => {
    const today = getTodayDateString();
    let csvContent = "data:text/csv;charset=utf-8,Sr. No.,Roll No.,Student Name,Specialisation,Status\n";
    students.forEach(student => {
      const status = attendance[student.rollNo] || 'Unmarked';
      const row = [student.srNo, student.rollNo, student.studentName, student.specialisation, status].join(",");
      csvContent += row + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `attendance_${today}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const stats = useMemo(() => {
    return Object.values(attendance).reduce((acc, status) => {
        if (status === 'Present') acc.present++;
        else if (status === 'Absent') acc.absent++;
        else acc.unmarked++;
        return acc;
    }, { present: 0, absent: 0, unmarked: 0 });
  }, [attendance]);

  const swipe = (dir: 'right' | 'left') => {
      if (currentIndex < 0) return;
      const studentToMark = unmarkedStudents[currentIndex];
      handleMarkAttendance(studentToMark.rollNo, dir === 'right' ? 'Present' : 'Absent');
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md flex flex-col md:flex-row justify-between items-center gap-4">
        <h2 className="text-xl font-bold">Today's Attendance ({getTodayDateString()})</h2>
        <div className="flex items-center gap-4 text-sm font-semibold">
          <span className="flex items-center gap-2 text-green-500"><CheckCircleIcon className="w-5 h-5"/> Present: {stats.present}</span>
          <span className="flex items-center gap-2 text-red-500"><XCircleIcon className="w-5 h-5"/> Absent: {stats.absent}</span>
          <span className="flex items-center gap-2 text-gray-500"><UserIcon className="w-5 h-5"/> Unmarked: {stats.unmarked}</span>
        </div>
      </div>

      <div className="relative h-[450px] flex items-center justify-center">
        {unmarkedStudents.length > 0 ? (
          <AnimatePresence>
            {unmarkedStudents.map((student, index) => (
              index === currentIndex &&
              <motion.div
                key={student.rollNo}
                drag="x"
                dragConstraints={{ left: -200, right: 200 }}
                dragElastic={1}
                onDragEnd={(_, info) => {
                  if (info.offset.x > 100) swipe('right');
                  if (info.offset.x < -100) swipe('left');
                }}
                initial={{ scale: 0.95, y: 20, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ x: currentIndex > index ? -300 : 300, opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
                className="absolute"
              >
                <StudentCard student={student} />
              </motion.div>
            ))}
          </AnimatePresence>
        ) : (
          <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-xl shadow-md">
            <h3 className="text-2xl font-bold text-green-500">All Done!</h3>
            <p className="text-gray-500 mt-2">You've marked attendance for all students.</p>
          </div>
        )}
      </div>
      <div className="flex justify-center items-center gap-8 mt-4">
        <button onClick={() => swipe('left')} className="p-4 bg-red-100 dark:bg-red-900 rounded-full text-red-500 hover:bg-red-200 dark:hover:bg-red-800 transition-colors disabled:opacity-50" disabled={unmarkedStudents.length === 0}><XCircleIcon className="w-8 h-8"/></button>
        <button onClick={() => swipe('right')} className="p-4 bg-green-100 dark:bg-green-900 rounded-full text-green-500 hover:bg-green-200 dark:hover:bg-green-800 transition-colors disabled:opacity-50" disabled={unmarkedStudents.length === 0}><CheckCircleIcon className="w-8 h-8"/></button>
      </div>

      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"/>
            <input
              type="text"
              placeholder="Search student by name or roll number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <button onClick={downloadCSV} className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
            <DownloadIcon className="w-5 h-5"/>
            Download CSV
          </button>
        </div>
        <div className="max-h-64 overflow-y-auto">
          {searchTerm && filteredStudents.map(student => (
            <div key={student.rollNo} className="flex items-center justify-between p-3 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
              <div>
                <p className="font-semibold">{student.studentName}</p>
                <p className="text-sm text-gray-500">{student.rollNo} - {student.specialisation}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleMarkAttendance(student.rollNo, 'Present')} className={`px-3 py-1 text-sm rounded-full ${attendance[student.rollNo] === 'Present' ? 'bg-green-500 text-white' : 'bg-gray-200 dark:bg-gray-600'}`}>Present</button>
                <button onClick={() => handleMarkAttendance(student.rollNo, 'Absent')} className={`px-3 py-1 text-sm rounded-full ${attendance[student.rollNo] === 'Absent' ? 'bg-red-500 text-white' : 'bg-gray-200 dark:bg-gray-600'}`}>Absent</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
