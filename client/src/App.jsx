import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import Users from './pages/admin/Users';
import Schools from './pages/admin/Schools';
import Classes from './pages/admin/Classes';
import Subjects from './pages/admin/Subjects';
import Assignments from './pages/admin/Assignments';
import Enrollments from './pages/admin/Enrollments';
import Attendance from './pages/teacher/Attendance';
import Grades from './pages/teacher/Grades';
import MyAttendance from './pages/student/MyAttendance';
import MyGrades from './pages/student/MyGrades';
import Profile from './pages/Profile';

function RoleRedirect() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === 'admin')   return <Navigate to="/admin/users" replace />;
  if (user.role === 'teacher') return <Navigate to="/teacher/attendance" replace />;
  return <Navigate to="/student/attendance" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<RoleRedirect />} />

            <Route path="/admin" element={
              <ProtectedRoute roles={['admin']}><Layout /></ProtectedRoute>
            }>
              <Route path="users"       element={<Users />} />
              <Route path="schools"     element={<Schools />} />
              <Route path="classes"     element={<Classes />} />
              <Route path="subjects"    element={<Subjects />} />
              <Route path="assignments" element={<Assignments />} />
              <Route path="enrollments" element={<Enrollments />} />
              <Route path="profile"     element={<Profile />} />
            </Route>

            <Route path="/teacher" element={
              <ProtectedRoute roles={['teacher', 'admin']}><Layout /></ProtectedRoute>
            }>
              <Route path="attendance" element={<Attendance />} />
              <Route path="grades"     element={<Grades />} />
              <Route path="profile"    element={<Profile />} />
            </Route>

            <Route path="/student" element={
              <ProtectedRoute roles={['student']}><Layout /></ProtectedRoute>
            }>
              <Route path="attendance" element={<MyAttendance />} />
              <Route path="grades"     element={<MyGrades />} />
              <Route path="profile"    element={<Profile />} />
            </Route>
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
