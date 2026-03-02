import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navConfig = {
  admin: [
    { to: '/admin/users',       label: 'Users' },
    { to: '/admin/schools',     label: 'Schools' },
    { to: '/admin/classes',     label: 'Classes' },
    { to: '/admin/subjects',    label: 'Subjects' },
    { to: '/admin/assignments', label: 'Assignments' },
    { to: '/admin/enrollments', label: 'Enrollments' },
  ],
  teacher: [
    { to: '/teacher/attendance', label: 'Attendance' },
    { to: '/teacher/grades',     label: 'Grades' },
  ],
  student: [
    { to: '/student/attendance', label: 'My Attendance' },
    { to: '/student/grades',     label: 'My Grades' },
  ],
};

const profilePath = { admin: '/admin/profile', teacher: '/teacher/profile', student: '/student/profile' };

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const links = navConfig[user?.role] || [];

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <div className="flex h-screen bg-gray-50">
      <aside className="w-60 bg-white border-r border-gray-200 flex flex-col shrink-0">
        <div className="px-6 py-5 border-b border-gray-200">
          <p className="text-base font-bold text-indigo-600">SchoolMS</p>
          <p className="text-xs text-gray-400 capitalize mt-0.5">{user?.role} Portal</p>
        </div>

        <nav className="flex-1 p-3 space-y-0.5">
          {links.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-600'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <p className="text-sm font-medium text-gray-700 truncate">{user?.name}</p>
          <p className="text-xs text-gray-400 truncate mb-3">{user?.email}</p>
          <div className="flex gap-3">
            <NavLink to={profilePath[user?.role]}
              className={({ isActive }) => `text-xs font-medium ${isActive ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}>
              Profile
            </NavLink>
            <button onClick={handleLogout} className="text-xs text-red-500 hover:text-red-700 font-medium">
              Sign out
            </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-auto p-8">
        <Outlet />
      </main>
    </div>
  );
}
