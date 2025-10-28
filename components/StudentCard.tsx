import React from 'react';
import type { Student } from '../types';

interface StudentCardProps {
  student: Student;
}

// Generates initials from a student's name
const getInitials = (name: string): string => {
  const nameParts = name.trim().split(' ').filter(Boolean);
  if (nameParts.length > 1) {
    return `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase();
  }
  if (nameParts.length === 1 && nameParts[0].length > 1) {
    return nameParts[0].substring(0, 2).toUpperCase();
  }
  return '??';
};

// A simple hash function to assign a consistent color based on roll number
const colors = [
  'bg-indigo-500', 'bg-blue-500', 'bg-purple-500', 'bg-pink-500',
  'bg-red-500', 'bg-orange-500', 'bg-green-500', 'bg-teal-500',
  'bg-fuchsia-500', 'bg-sky-500', 'bg-emerald-500', 'bg-rose-500'
];

const getColorForStudent = (rollNo: string): string => {
  let hash = 0;
  for (let i = 0; i < rollNo.length; i++) {
    hash = rollNo.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash % colors.length);
  return colors[index];
};

const StudentCard: React.FC<StudentCardProps> = ({ student }) => {
  const initials = getInitials(student.studentName);
  const avatarColor = getColorForStudent(student.rollNo);

  return (
    <div className="relative w-72 h-96 bg-white dark:bg-gray-800 rounded-2xl shadow-xl flex flex-col justify-center items-center p-6 space-y-6 text-center cursor-grab active:cursor-grabbing">
      <div className={`w-32 h-32 rounded-full flex items-center justify-center ${avatarColor}`}>
        <span className="text-5xl font-bold text-white tracking-wider">{initials}</span>
      </div>

      <div className="space-y-2">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white" title={student.studentName}>
            {student.studentName}
        </h3>
        <p className="text-lg font-medium text-gray-600 dark:text-gray-400">{student.rollNo}</p>
        <p className={`inline-block px-3 py-1 text-sm font-semibold rounded-full ${
            student.specialisation === 'CSE' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' : 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
            }`}>
            {student.specialisation}
        </p>
      </div>
    </div>
  );
};

export default StudentCard;
