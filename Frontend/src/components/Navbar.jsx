import { useContext, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LayoutDashboard, Users, Stethoscope, Receipt, Pill, LogOut, Menu, X, Activity } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/patients',  label: 'Patients',  icon: Users },
    { path: '/doctors',   label: 'Doctors',   icon: Stethoscope },
    { path: '/billing',   label: 'Billing',   icon: Receipt },
    { path: '/pharmacy',  label: 'Pharmacy',  icon: Pill },
  ];

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <>
      <nav className="sticky top-0 z-[1000] h-16 flex items-center justify-between px-6
        bg-white border-b border-green-100 shadow-sm shadow-green-100/50 gap-4">

        {/* Brand */}
        <Link to="/" className="flex items-center gap-2.5 no-underline flex-shrink-0">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600
            flex items-center justify-center shadow-md shadow-green-200">
            <Activity className="w-4 h-4 text-white" />
          </div>
          <span className="text-[15px] font-bold text-slate-800 tracking-tight">
            MediCore <span className="text-green-600">HMS</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <ul className="hidden md:flex items-center gap-1 list-none m-0 p-0 flex-1 justify-center">
          {navLinks.map(({ path, label, icon: Icon }) => {
            const isActive = location.pathname === path;
            return (
              <li key={path}>
                <Link
                  to={path}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-[13.5px] font-medium
                    no-underline transition-all duration-150 whitespace-nowrap
                    ${isActive
                      ? 'bg-green-50 text-green-700 font-semibold'
                      : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                    }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-green-600' : 'text-slate-400'}`} />
                  {label}
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 ml-0.5" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* User Section */}
        <div className="hidden md:flex items-center gap-3 flex-shrink-0">
          {user ? (
            <>
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-100
                rounded-xl px-3 py-1.5">
                <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-green-400 to-emerald-500
                  flex items-center justify-center text-white text-[11px] font-bold">
                  {user.username?.[0]?.toUpperCase() ?? '?'}
                </div>
                <span className="text-[13px] text-slate-600 font-medium">{user.username}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 text-[13px] text-slate-400 hover:text-red-500
                  border border-slate-100 hover:border-red-200 hover:bg-red-50
                  px-3 py-1.5 rounded-xl font-medium transition-all duration-150 cursor-pointer bg-transparent"
              >
                <LogOut className="w-3.5 h-3.5" />
                Logout
              </button>
            </>
          ) : (
            <Link to="/login"
              className="bg-green-600 hover:bg-green-500 text-white text-[13px] font-semibold
                px-4 py-2 rounded-xl no-underline transition-all">
              Sign In
            </Link>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-50
            border-none bg-transparent cursor-pointer transition-all"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden sticky top-16 z-[999] bg-white border-b border-green-100
          shadow-lg shadow-green-50">
          <div className="flex flex-col p-3 gap-1">
            {navLinks.map(({ path, label, icon: Icon }) => {
              const isActive = location.pathname === path;
              return (
                <Link
                  key={path}
                  to={path}
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-[14px] font-medium
                    no-underline transition-all
                    ${isActive
                      ? 'bg-green-50 text-green-700'
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                    }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-green-600' : 'text-slate-400'}`} />
                  {label}
                  {isActive && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-green-500" />}
                </Link>
              );
            })}
            <div className="h-px bg-slate-100 my-1" />
            {user && (
              <button
                onClick={() => { handleLogout(); setMenuOpen(false); }}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-[14px] font-medium
                  text-red-400 hover:bg-red-50 hover:text-red-500 transition-all
                  border-none bg-transparent cursor-pointer w-full text-left"
              >
                <LogOut className="w-4 h-4" />
                Logout ({user.username})
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;