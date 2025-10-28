
export interface Student {
  srNo: number;
  rollNo: string;
  specialisation: 'CSE' | 'IT';
  studentName: string;
  admissionDate: string;
}

export type AttendanceStatus = 'Present' | 'Absent' | 'Unmarked';

export type DailyAttendance = {
  [rollNo: string]: AttendanceStatus;
};

export type AttendanceHistory = {
  [date: string]: DailyAttendance;
};

export type UserRole = 'teacher' | 'student';
