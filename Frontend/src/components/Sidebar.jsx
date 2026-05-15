import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, Users, Stethoscope, Calendar,
  CreditCard, Pill, LogOut, Heart
} from 'lucide-react';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/patients', icon: Users, label: 'Patients' },
  { to: '/doctors', icon: Stethoscope, label: 'Doctors' },
  { to: '/appointments', icon: Calendar, label: 'Appointments' },
  { to: '/billing', icon: CreditCard, label: 'Billing' },
  { to: '/pharmacy', icon: Pill, label: 'Pharmacy' },
];

export default function Sidebar() {
  const { user, logout } = useAuth();

  return (
    <div className="w-64 bg-blue-900 text-white flex flex-col">
      <div className="p-6 flex items-center gap-3 border-b border-blue-800">
        <Heart className="text-red-400" size={24} />
        <div>
          <h1 className="font-bold text-lg">MedCare HMS</h1>
          <p className="text-blue-300 text-xs">Hospital Management</p>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive ? 'bg-blue-700 text-white' : 'text-blue-200 hover:bg-blue-800'
              }`
            }
          >
            <Icon size={20} />
            <span className="text-sm font-medium">{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-blue-800">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
            {user?.username?.[0]?.toUpperCase()}
          </div>
          <span className="text-sm">{user?.username}</span>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-2 text-blue-300 hover:text-white text-sm transition-colors"
        >
          <LogOut size={16} /> Logout
        </button>
      </div>
    </div>
  );
}